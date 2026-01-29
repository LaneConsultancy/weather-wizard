# Google Ads MCP Server - Setup Guide

This guide will walk you through setting up the Google Ads MCP server for use with Claude Code.

## Quick Start

1. **Install dependencies** (already done if you see this file):
   ```bash
   cd weather-wizard-site/mcp/google-ads
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to the project root as `.env`
   - Fill in your Google Ads API credentials (see below)

3. **Build the server** (already done):
   ```bash
   npm run build
   ```

4. **The server is now ready to use with Claude Code!**

## Obtaining Google Ads API Credentials

### 1. Developer Token
- Go to [Google Ads API Center](https://ads.google.com/aw/apicenter)
- Apply for API access
- You'll receive a developer token (usually starts with your customer ID)
- Note: Basic access is sufficient for most operations

### 2. OAuth 2.0 Credentials (Client ID & Secret)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one
- Enable the "Google Ads API"
- Navigate to Credentials → Create Credentials → OAuth Client ID
- Choose "Desktop app" as the application type
- Save your Client ID and Client Secret

### 3. Refresh Token
You need to generate this through an OAuth flow. Here's a simple way:

```bash
# Use the official Google Ads API tool
npm install -g google-ads-oauth-cli

# Run the OAuth flow
google-ads-oauth-cli \
  --client-id YOUR_CLIENT_ID \
  --client-secret YOUR_CLIENT_SECRET
```

Follow the prompts to authorize access and you'll receive a refresh token.

Alternatively, use this Node.js script:

```javascript
import { GoogleAdsApi } from 'google-ads-api';
import http from 'http';
import url from 'url';

const client = new GoogleAdsApi({
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET',
  developer_token: 'YOUR_DEVELOPER_TOKEN',
});

// This will open a browser for OAuth flow
const authUrl = client.getAuthorizationUrl();
console.log('Visit this URL to authorize:', authUrl);

// Set up a local server to capture the callback
const server = http.createServer(async (req, res) => {
  const query = url.parse(req.url, true).query;
  if (query.code) {
    const tokens = await client.getAccessToken(query.code);
    console.log('Your refresh token:', tokens.refresh_token);
    res.end('Authentication successful! You can close this window.');
    server.close();
  }
});
server.listen(3000);
```

### 4. Customer ID
- Log into your Google Ads account
- Your customer ID is the 10-digit number at the top (format: XXX-XXX-XXXX)
- Use it WITHOUT dashes in the .env file

## Environment Variables

Create `/Users/georgelane/Dropbox/Projects/Weather Wizard/.env`:

```env
GOOGLE_ADS_CLIENT_ID=123456789012-abc123def456.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-abc123def456
GOOGLE_ADS_DEVELOPER_TOKEN=abc123def456
GOOGLE_ADS_REFRESH_TOKEN=1//abc123def456
GOOGLE_ADS_CUSTOMER_ID=1234567890
```

## Testing the Server

Once configured, you can test by running:

```bash
cd weather-wizard-site/mcp/google-ads
npm start
```

The server will wait for MCP commands on stdin/stdout.

To test with Claude Code, simply ask Claude to use any of the Google Ads tools. For example:

- "List all my Google Ads campaigns"
- "Show me the performance of campaign 12345678"
- "Add keywords to ad group 87654321"

## Available Tools

All 13 tools are documented in [README.md](./README.md).

## Troubleshooting

### "Missing required environment variables"
- Ensure your `.env` file is in the project root (not in the mcp folder)
- Verify all 5 variables are set

### "Authentication failed"
- Check that your refresh token hasn't expired (they typically don't expire, but can be revoked)
- Verify your OAuth credentials are correct
- Ensure the Google Ads API is enabled in your Google Cloud project

### "Customer not found"
- Verify your customer ID is correct (10 digits, no dashes)
- Ensure the OAuth account has access to this customer account
- Check that you're using the manager account ID if applicable

### Build errors
```bash
# Clean and rebuild
rm -rf build node_modules
npm install
npm run build
```

## Security Best Practices

1. **Never commit your .env file** - it's already in .gitignore
2. **Keep your developer token secure** - treat it like a password
3. **Rotate refresh tokens regularly** - regenerate every few months
4. **Use read-only access where possible** - request minimal permissions
5. **Monitor API usage** - stay within Google's rate limits

## Next Steps

Once configured, you can:
- List and manage campaigns
- View performance reports
- Add/remove keywords
- Update ad URLs for tracking
- Monitor search terms that trigger your ads

All through natural language requests to Claude Code!
