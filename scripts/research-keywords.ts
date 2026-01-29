/**
 * Keyword Research Script for Weather Wizard
 *
 * This script generates keyword ideas for roofing services across all 21 Kent locations.
 * Useful for planning campaigns and understanding search volumes.
 *
 * Run with: npm run research-keywords
 */

import { getKeywordIdeas } from '../lib/google-ads/keywords';
import { getAllAreas } from '../lib/areas';

// Core roofing services
const services = [
  'roof repairs',
  'roof repair',
  'roofing',
  'roofer',
  'emergency roof repair',
  'roof leak repair',
  'guttering',
  'gutter cleaning',
  'chimney repair',
  'flat roofing',
  'fascias and soffits',
];

interface KeywordResult {
  area: string;
  keyword: string;
  monthlySearches: number;
  competition: string;
  competitionIndex: number;
  suggestedBidLow: number;
  suggestedBidHigh: number;
}

async function researchKeywords() {
  console.log('🔍 Weather Wizard - Keyword Research\n');
  console.log('='.repeat(70));
  console.log('Researching keywords for roofing services across Kent locations...\n');

  const areas = getAllAreas();
  const results: KeywordResult[] = [];

  // Generate location-based seed keywords
  const seedKeywords: string[] = [];

  // Add core services
  seedKeywords.push(...services);

  // Add location-specific variations for a few key areas
  const keyAreas = ['Maidstone', 'Canterbury', 'Ashford', 'Dartford', 'Tonbridge'];
  keyAreas.forEach(area => {
    seedKeywords.push(`roofer ${area.toLowerCase()}`);
    seedKeywords.push(`roof repair ${area.toLowerCase()}`);
    seedKeywords.push(`roofing ${area.toLowerCase()}`);
  });

  console.log(`📋 Seed Keywords (${seedKeywords.length} total):`);
  seedKeywords.forEach((keyword, index) => {
    console.log(`   ${index + 1}. "${keyword}"`);
  });

  console.log('\n⏳ Fetching keyword ideas from Google Ads API...\n');

  try {
    // Get keyword ideas for UK, English language
    const ideas = await getKeywordIdeas(seedKeywords, {
      location: '2826', // United Kingdom
      language: '1000', // English
      includeAdultKeywords: false,
    });

    console.log(`✅ Found ${ideas.length} keyword ideas\n`);
    console.log('='.repeat(70));
    console.log('\n📊 Top Keywords by Search Volume:\n');

    // Sort by monthly searches (descending)
    const sortedIdeas = ideas
      .map(idea => ({
        keyword: idea.text,
        monthlySearches: parseInt(idea.avgMonthlySearches),
        competition: idea.competition,
        competitionIndex: parseFloat(idea.competitionIndex),
        suggestedBidLow: parseInt(idea.lowTopOfPageBidMicros) / 1_000_000,
        suggestedBidHigh: parseInt(idea.highTopOfPageBidMicros) / 1_000_000,
      }))
      .sort((a, b) => b.monthlySearches - a.monthlySearches);

    // Display top 30 keywords
    sortedIdeas.slice(0, 30).forEach((idea, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. "${idea.keyword}"`);
      console.log(`    Monthly Searches: ${idea.monthlySearches.toLocaleString()}`);
      console.log(`    Competition: ${idea.competition} (Index: ${idea.competitionIndex})`);
      console.log(`    Suggested Bid: £${idea.suggestedBidLow.toFixed(2)} - £${idea.suggestedBidHigh.toFixed(2)}`);
      console.log('');
    });

    // Categorize keywords
    console.log('='.repeat(70));
    console.log('\n📈 Keywords by Category:\n');

    const categories = {
      'Emergency/Urgent': sortedIdeas.filter(k =>
        k.keyword.includes('emergency') || k.keyword.includes('urgent') || k.keyword.includes('leak')
      ),
      'Roof Repairs': sortedIdeas.filter(k =>
        k.keyword.includes('repair') && !k.keyword.includes('emergency')
      ),
      'General Roofing': sortedIdeas.filter(k =>
        (k.keyword.includes('roofer') || k.keyword.includes('roofing')) &&
        !k.keyword.includes('repair')
      ),
      'Guttering': sortedIdeas.filter(k =>
        k.keyword.includes('gutter') || k.keyword.includes('guttering')
      ),
      'Chimney': sortedIdeas.filter(k => k.keyword.includes('chimney')),
      'Flat Roofing': sortedIdeas.filter(k => k.keyword.includes('flat')),
      'Location-Specific': sortedIdeas.filter(k => {
        const lowerKeyword = k.keyword.toLowerCase();
        return areas.some(area => lowerKeyword.includes(area.name.toLowerCase()));
      }),
    };

    Object.entries(categories).forEach(([category, keywords]) => {
      if (keywords.length > 0) {
        console.log(`\n${category} (${keywords.length} keywords):`);
        keywords.slice(0, 5).forEach(k => {
          console.log(`   • "${k.keyword}" - ${k.monthlySearches.toLocaleString()} searches/month`);
        });
      }
    });

    // Summary statistics
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 Summary Statistics:\n');

    const totalSearchVolume = sortedIdeas.reduce((sum, k) => sum + k.monthlySearches, 0);
    const avgSearchVolume = totalSearchVolume / sortedIdeas.length;
    const avgBid = sortedIdeas.reduce((sum, k) => sum + k.suggestedBidHigh, 0) / sortedIdeas.length;

    const highVolume = sortedIdeas.filter(k => k.monthlySearches >= 1000).length;
    const mediumVolume = sortedIdeas.filter(k => k.monthlySearches >= 100 && k.monthlySearches < 1000).length;
    const lowVolume = sortedIdeas.filter(k => k.monthlySearches < 100).length;

    const highCompetition = sortedIdeas.filter(k => k.competition === 'HIGH').length;
    const mediumCompetition = sortedIdeas.filter(k => k.competition === 'MEDIUM').length;
    const lowCompetition = sortedIdeas.filter(k => k.competition === 'LOW').length;

    console.log(`Total Keywords Found: ${sortedIdeas.length}`);
    console.log(`Total Monthly Search Volume: ${totalSearchVolume.toLocaleString()}`);
    console.log(`Average Monthly Searches: ${Math.round(avgSearchVolume).toLocaleString()}`);
    console.log(`Average Suggested Bid: £${avgBid.toFixed(2)}`);
    console.log('');
    console.log('Volume Distribution:');
    console.log(`   High (1000+): ${highVolume} keywords`);
    console.log(`   Medium (100-999): ${mediumVolume} keywords`);
    console.log(`   Low (<100): ${lowVolume} keywords`);
    console.log('');
    console.log('Competition Distribution:');
    console.log(`   High: ${highCompetition} keywords`);
    console.log(`   Medium: ${mediumCompetition} keywords`);
    console.log(`   Low: ${lowCompetition} keywords`);

    console.log('\n' + '='.repeat(70));
    console.log('\n💡 Recommendations:\n');
    console.log('1. Focus on high-volume, low-competition keywords first');
    console.log('2. Create location-specific campaigns for major areas');
    console.log('3. Bid higher on emergency/urgent keywords (high intent)');
    console.log('4. Use broad match for discovery, then refine to phrase/exact');
    console.log('5. Budget approximately £25-50/day per major campaign\n');

  } catch (error: any) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ Error during keyword research:');
    console.error('='.repeat(70));
    console.error(`\n${error.message}`);

    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err: any) => {
        console.error(`\n🔴 ${err.error_code?.authorization_error || 'Unknown Error'}`);
        console.error(`   ${err.message}`);
      });
    }

    process.exit(1);
  }
}

// Run the research
researchKeywords();
