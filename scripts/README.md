# Google Ads API Token Generator

This script helps you generate a refresh token for the Google Ads API through OAuth2 authentication.

## Prerequisites

Before running this script, you need to set up OAuth2 credentials in Google Cloud Console:

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable the Google Ads API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google Ads API"
3. Click on it and click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields (app name, user support email, developer email)
   - Add your email as a test user
   - Save and continue through the steps
4. Back in "Create OAuth client ID":
   - Application type: **Desktop app**
   - Name: "Google Ads API Token Generator" (or any name you prefer)
   - Click "Create"
5. You'll see your Client ID and Client Secret - keep these handy
6. Click "OK" to close the dialog
7. Find your newly created OAuth client in the list
8. Click the pencil icon to edit it
9. Under "Authorized redirect URIs", click "Add URI"
10. Add: `http://localhost:3001/oauth2callback`
11. Click "Save"

## Installation

1. Navigate to the weather-wizard-site directory:
   ```bash
   cd weather-wizard-site
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

   This will install:
   - `tsx` - TypeScript executor for Node.js
   - `open` - Package to open the browser automatically

## Usage

### Option 1: With Environment Variables (Recommended)

Set your OAuth2 credentials as environment variables and run the script:

```bash
GOOGLE_ADS_CLIENT_ID="your-client-id.apps.googleusercontent.com" \
GOOGLE_ADS_CLIENT_SECRET="your-client-secret" \
npm run get-google-ads-token
```

### Option 2: Interactive Prompts

Run the script without environment variables and it will prompt you:

```bash
npm run get-google-ads-token
```

You'll be asked to enter:
- OAuth2 Client ID
- OAuth2 Client Secret

## What Happens

1. **Local Server Starts**: A local HTTP server starts on port 3001
2. **Browser Opens**: Your default browser opens to Google's OAuth consent page
3. **You Authorize**: Sign in with your Google account and grant permissions
4. **Callback Handled**: Google redirects back to localhost:3001 with an authorization code
5. **Token Exchange**: The script exchanges the code for an access token and refresh token
6. **Results Displayed**: Your refresh token is displayed in the terminal

## Output

Upon success, you'll see:

```
=== ✓ SUCCESS ===

Your Google Ads API refresh token has been generated!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REFRESH TOKEN:
1//0abc123def456...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Additional Details:
- Access Token: ya29.abc123def456...
- Token Type: Bearer
- Expires In: 3599 seconds
- Scope: https://www.googleapis.com/auth/adwords

Next Steps:
1. Save your refresh token in a secure location
2. Add it to your .env file as GOOGLE_ADS_REFRESH_TOKEN
3. Never commit the refresh token to version control

Example .env entry:
GOOGLE_ADS_REFRESH_TOKEN=1//0abc123def456...
```

## Saving Your Token

1. Copy the refresh token from the terminal output
2. Add it to your `.env.local` file:
   ```
   GOOGLE_ADS_REFRESH_TOKEN=1//0abc123def456...
   GOOGLE_ADS_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_ADS_CLIENT_SECRET=your-client-secret
   GOOGLE_ADS_CUSTOMER_ID=123-456-7890
   GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
   ```
3. Make sure `.env.local` is in your `.gitignore` (it should be by default in Next.js projects)

## Troubleshooting

### Port 3001 Already in Use

If you see an error about port 3001 being in use:
- Stop any other services running on that port
- Or edit the script to use a different port (change the `PORT` constant and update the redirect URI in Google Cloud Console)

### Browser Doesn't Open

If the browser doesn't open automatically:
- Look for the URL in the terminal output
- Manually copy and paste it into your browser

### "redirect_uri_mismatch" Error

This means the redirect URI in the script doesn't match what's configured in Google Cloud Console:
- Verify `http://localhost:3001/oauth2callback` is added as an authorized redirect URI
- Check for typos or extra spaces
- Make sure you saved the OAuth client configuration

### No Refresh Token in Response

If you don't receive a refresh token:
- The script forces `prompt=consent` which should always provide a refresh token
- Try revoking access at https://myaccount.google.com/permissions and run the script again
- Ensure you're using "Desktop app" type OAuth credentials, not "Web application"

### "Access blocked: Authorization Error"

This can happen if:
- Your app is not verified and you're not a test user
- Add your email as a test user in the OAuth consent screen configuration
- Or complete the app verification process (only needed for production use)

## Security Notes

- **Never commit** your refresh token to version control
- Store it securely in `.env.local` or a secrets manager
- The refresh token provides long-term access to your Google Ads account
- Treat it like a password
- If compromised, revoke it at https://myaccount.google.com/permissions

## Need Help?

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [OAuth 2.0 for Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)
- Check that all prerequisites are completed in order
