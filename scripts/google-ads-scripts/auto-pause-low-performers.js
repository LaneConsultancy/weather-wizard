/**
 * Google Ads Script: Auto-Pause Low Performing Ad Groups
 *
 * Purpose: Pauses ad groups that have spent £100+ with 0 conversions
 *
 * How it works:
 * 1. Scans all enabled ad groups for spend > £100 and conversions = 0
 * 2. Labels ad groups that hit the threshold with timestamp
 * 3. After 24 hours, if still no conversions, pauses the ad group
 * 4. Sends email notification when ad groups are paused
 *
 * Setup Instructions:
 * 1. Go to Google Ads > Tools & Settings > Bulk Actions > Scripts
 * 2. Click the + button to create a new script
 * 3. Paste this entire script
 * 4. Update the CONFIG section below with your email
 * 5. Click "Authorize" and grant permissions
 * 6. Click "Preview" to test (shows what would happen, but labels won't persist)
 * 7. Click "Run" to execute for real
 * 8. Set up a schedule (recommended: every 6 hours)
 *
 * IMPORTANT: Preview mode will show "Preview mode detected" warnings because
 * label creation doesn't persist in preview. This is normal - run the actual
 * script to see it work.
 *
 * Labels used:
 * - "AutoPause_Flagged_YYYYMMDD_HHMM" - Marks when threshold was first hit
 * - "AutoPause_Paused" - Marks ad groups paused by this script
 */

// =============================================================================
// CONFIGURATION - Update these values
// =============================================================================

var CONFIG = {
  // Email to receive notifications (leave empty to disable)
  notificationEmail: 'george@laneconsultancy.com',

  // Spend threshold in account currency (£100)
  spendThreshold: 100,

  // Hours to wait before pausing (24 hours for late conversion reporting)
  delayHours: 24,

  // Date range for metrics (ALL_TIME, LAST_30_DAYS, LAST_7_DAYS, etc.)
  dateRange: 'ALL_TIME',

  // Only check specific campaigns (leave empty to check all)
  // Example: ['Search - Roofing - Top 5 Towns', 'Search - Roofing - Kent Wide']
  campaignNames: [],

  // Label prefix for tracking
  labelPrefix: 'AutoPause_Flagged_',

  // Label for paused ad groups
  pausedLabel: 'AutoPause_Paused'
};

// =============================================================================
// MAIN FUNCTION
// =============================================================================

function main() {
  Logger.log('================================================================================');
  Logger.log('Auto-Pause Low Performers Script');
  Logger.log('Started: ' + new Date().toISOString());
  Logger.log('================================================================================');

  // Track results
  var flaggedAdGroups = [];
  var pausedAdGroups = [];
  var stillWaitingAdGroups = [];
  var isPreviewMode = false;

  // Build campaign filter if specified
  var campaignFilter = '';
  if (CONFIG.campaignNames.length > 0) {
    var campaignConditions = CONFIG.campaignNames.map(function(name) {
      return "CampaignName = '" + name + "'";
    }).join(' OR ');
    campaignFilter = ' AND (' + campaignConditions + ')';
  }

  // Query for ad groups with high spend and no conversions
  // Note: Cost is in micros (1,000,000 = £1), Conversions < 1 means 0 conversions
  var query = 'SELECT AdGroupId, AdGroupName, CampaignName, Cost, Conversions, AdGroupStatus ' +
              'FROM ADGROUP_PERFORMANCE_REPORT ' +
              'WHERE AdGroupStatus = ENABLED ' +
              'AND Cost > ' + (CONFIG.spendThreshold * 1000000) + ' ' +
              'AND Conversions < 1 ' +
              campaignFilter +
              'DURING ' + CONFIG.dateRange;

  Logger.log('\nQuery: ' + query);
  Logger.log('\n--------------------------------------------------------------------------------');
  Logger.log('SCANNING AD GROUPS');
  Logger.log('--------------------------------------------------------------------------------');

  var report = AdsApp.report(query);
  var rows = report.rows();

  while (rows.hasNext()) {
    var row = rows.next();
    var adGroupId = row['AdGroupId'];
    var adGroupName = row['AdGroupName'];
    var campaignName = row['CampaignName'];
    var cost = parseFloat(row['Cost'].replace(/,/g, ''));
    var conversions = parseFloat(row['Conversions'].replace(/,/g, ''));

    Logger.log('\nFound: ' + campaignName + ' > ' + adGroupName);
    Logger.log('  Spend: £' + cost.toFixed(2) + ' | Conversions: ' + conversions);

    // Get the ad group object
    var adGroupIterator = AdsApp.adGroups()
      .withCondition('AdGroupId = ' + adGroupId)
      .get();

    if (!adGroupIterator.hasNext()) {
      Logger.log('  ⚠️ Could not find ad group object');
      continue;
    }

    var adGroup = adGroupIterator.next();

    // Check if already flagged with our label prefix
    var flagLabel = getFlagLabel(adGroup);

    if (flagLabel) {
      // Already flagged - check if 24 hours have passed
      var flagTime = parseLabelTimestamp(flagLabel.getName());
      var hoursSinceFlagged = (new Date() - flagTime) / (1000 * 60 * 60);

      Logger.log('  ⏱️ Flagged ' + hoursSinceFlagged.toFixed(1) + ' hours ago');

      if (hoursSinceFlagged >= CONFIG.delayHours) {
        // Time to pause
        Logger.log('  🛑 PAUSING - 24 hour delay exceeded');

        adGroup.pause();

        // Apply paused label and remove flag label
        var pausedLabelApplied = safeApplyLabel(adGroup, CONFIG.pausedLabel);
        if (pausedLabelApplied) {
          safeRemoveLabel(adGroup, flagLabel.getName());
        }

        pausedAdGroups.push({
          campaign: campaignName,
          adGroup: adGroupName,
          spend: cost,
          conversions: conversions,
          hoursFlagged: hoursSinceFlagged
        });
      } else {
        // Still waiting
        Logger.log('  ⏳ Waiting - ' + (CONFIG.delayHours - hoursSinceFlagged).toFixed(1) + ' hours remaining');

        stillWaitingAdGroups.push({
          campaign: campaignName,
          adGroup: adGroupName,
          spend: cost,
          conversions: conversions,
          hoursRemaining: CONFIG.delayHours - hoursSinceFlagged
        });
      }
    } else {
      // Not flagged yet - flag it now
      var labelName = CONFIG.labelPrefix + formatTimestamp(new Date());
      Logger.log('  🚩 FLAGGING - Creating label: ' + labelName);

      var labelApplied = safeApplyLabel(adGroup, labelName);

      if (!labelApplied) {
        isPreviewMode = true;
      }

      flaggedAdGroups.push({
        campaign: campaignName,
        adGroup: adGroupName,
        spend: cost,
        conversions: conversions
      });
    }
  }

  // Log summary
  Logger.log('\n================================================================================');
  Logger.log('SUMMARY');
  Logger.log('================================================================================');
  Logger.log('Newly flagged: ' + flaggedAdGroups.length);
  Logger.log('Still waiting: ' + stillWaitingAdGroups.length);
  Logger.log('Paused: ' + pausedAdGroups.length);

  if (isPreviewMode) {
    Logger.log('\n⚠️ PREVIEW MODE DETECTED - Labels were not persisted.');
    Logger.log('   Run the script (not preview) to actually apply labels.');
  }

  // Send email notification if any ad groups were paused or flagged
  if (CONFIG.notificationEmail && (pausedAdGroups.length > 0 || flaggedAdGroups.length > 0)) {
    sendNotificationEmail(flaggedAdGroups, stillWaitingAdGroups, pausedAdGroups, isPreviewMode);
  }

  Logger.log('\nCompleted: ' + new Date().toISOString());
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Safely creates a label and applies it to an ad group.
 * Returns true if successful, false if in preview mode or error.
 */
function safeApplyLabel(adGroup, labelName) {
  try {
    // First, check if label already exists
    var existingLabel = AdsApp.labels()
      .withCondition("Name = '" + labelName + "'")
      .get();

    if (!existingLabel.hasNext()) {
      // Label doesn't exist, create it
      AdsApp.createLabel(labelName, 'Created by Auto-Pause script', '#FF6B6B');
    }

    // Verify label now exists (will fail in preview mode)
    var verifyLabel = AdsApp.labels()
      .withCondition("Name = '" + labelName + "'")
      .get();

    if (!verifyLabel.hasNext()) {
      // We're in preview mode - label creation was simulated
      Logger.log('  ⚠️ Preview mode: Label "' + labelName + '" not persisted');
      return false;
    }

    // Apply the label
    adGroup.applyLabel(labelName);
    Logger.log('  ✅ Applied label: ' + labelName);
    return true;

  } catch (e) {
    Logger.log('  ❌ Error applying label: ' + e.message);
    return false;
  }
}

/**
 * Safely removes a label from an ad group
 */
function safeRemoveLabel(adGroup, labelName) {
  try {
    adGroup.removeLabel(labelName);
    Logger.log('  ✅ Removed label: ' + labelName);
    return true;
  } catch (e) {
    Logger.log('  ⚠️ Could not remove label: ' + e.message);
    return false;
  }
}

/**
 * Gets the flag label for an ad group (if any)
 */
function getFlagLabel(adGroup) {
  var labelIterator = adGroup.labels().get();

  while (labelIterator.hasNext()) {
    var label = labelIterator.next();
    if (label.getName().indexOf(CONFIG.labelPrefix) === 0) {
      return label;
    }
  }

  return null;
}

/**
 * Formats a date as YYYYMMDD_HHMM for label names
 */
function formatTimestamp(date) {
  var year = date.getFullYear();
  var month = padZero(date.getMonth() + 1);
  var day = padZero(date.getDate());
  var hours = padZero(date.getHours());
  var minutes = padZero(date.getMinutes());

  return year + month + day + '_' + hours + minutes;
}

/**
 * Pads a number with leading zero if needed
 */
function padZero(num) {
  return (num < 10 ? '0' : '') + num;
}

/**
 * Parses a timestamp from a label name
 */
function parseLabelTimestamp(labelName) {
  var timestamp = labelName.replace(CONFIG.labelPrefix, '');
  var year = parseInt(timestamp.substr(0, 4), 10);
  var month = parseInt(timestamp.substr(4, 2), 10) - 1;
  var day = parseInt(timestamp.substr(6, 2), 10);
  var hours = parseInt(timestamp.substr(9, 2), 10);
  var minutes = parseInt(timestamp.substr(11, 2), 10);

  return new Date(year, month, day, hours, minutes);
}

/**
 * Sends email notification
 */
function sendNotificationEmail(flagged, waiting, paused, isPreviewMode) {
  var subject = '🚨 Google Ads Auto-Pause Alert';
  var body = [];

  body.push('Google Ads Auto-Pause Script Report');
  body.push('Account: Weather Wizard Roofing');
  body.push('Time: ' + new Date().toISOString());
  body.push('');
  body.push('Threshold: £' + CONFIG.spendThreshold + ' spend with 0 conversions');
  body.push('Delay: ' + CONFIG.delayHours + ' hours');
  body.push('');

  if (isPreviewMode) {
    body.push('⚠️ PREVIEW MODE - No actual changes were made');
    body.push('');
  }

  if (paused.length > 0) {
    body.push('============================================================');
    body.push('🛑 AD GROUPS PAUSED (' + paused.length + ')');
    body.push('============================================================');
    for (var i = 0; i < paused.length; i++) {
      var ag = paused[i];
      body.push('');
      body.push('Campaign: ' + ag.campaign);
      body.push('Ad Group: ' + ag.adGroup);
      body.push('Spend: £' + ag.spend.toFixed(2));
      body.push('Conversions: ' + ag.conversions);
      body.push('Hours since flagged: ' + ag.hoursFlagged.toFixed(1));
    }
    body.push('');
  }

  if (flagged.length > 0) {
    body.push('============================================================');
    body.push('🚩 NEWLY FLAGGED (' + flagged.length + ')');
    body.push('============================================================');
    for (var j = 0; j < flagged.length; j++) {
      var ag2 = flagged[j];
      body.push('');
      body.push('Campaign: ' + ag2.campaign);
      body.push('Ad Group: ' + ag2.adGroup);
      body.push('Spend: £' + ag2.spend.toFixed(2));
      body.push('Conversions: ' + ag2.conversions);
      body.push('Will be paused in ' + CONFIG.delayHours + ' hours if no conversions');
    }
    body.push('');
  }

  if (waiting.length > 0) {
    body.push('============================================================');
    body.push('⏳ WAITING (' + waiting.length + ')');
    body.push('============================================================');
    for (var k = 0; k < waiting.length; k++) {
      var ag3 = waiting[k];
      body.push('');
      body.push('Campaign: ' + ag3.campaign);
      body.push('Ad Group: ' + ag3.adGroup);
      body.push('Spend: £' + ag3.spend.toFixed(2));
      body.push('Hours remaining: ' + ag3.hoursRemaining.toFixed(1));
    }
    body.push('');
  }

  body.push('');
  body.push('---');
  body.push('To adjust settings, edit the script in Google Ads.');

  MailApp.sendEmail({
    to: CONFIG.notificationEmail,
    subject: subject,
    body: body.join('\n')
  });

  Logger.log('\n📧 Email notification sent to: ' + CONFIG.notificationEmail);
}
