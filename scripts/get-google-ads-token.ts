#!/usr/bin/env node

/**
 * Google Ads API OAuth2 Token Generator
 *
 * This script helps you generate a refresh token for the Google Ads API.
 *
 * Prerequisites:
 * 1. Create a project in Google Cloud Console
 * 2. Enable the Google Ads API
 * 3. Create OAuth 2.0 credentials (Desktop application type)
 * 4. Add http://localhost:3001/oauth2callback as an authorized redirect URI
 *
 * Usage:
 * npm run get-google-ads-token
 *
 * Or with environment variables:
 * GOOGLE_ADS_CLIENT_ID=xxx GOOGLE_ADS_CLIENT_SECRET=yyy npm run get-google-ads-token
 */

import http from 'http';
import { URL } from 'url';
import readline from 'readline';
import open from 'open';

const PORT = 3001;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = 'https://www.googleapis.com/auth/adwords';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/**
 * Prompts the user for input via the console
 */
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Gets OAuth2 credentials from environment variables or prompts the user
 */
async function getCredentials(): Promise<{ clientId: string; clientSecret: string }> {
  console.log('\n=== Google Ads API OAuth2 Token Generator ===\n');

  let clientId = process.env.GOOGLE_ADS_CLIENT_ID || '';
  let clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET || '';

  if (!clientId) {
    console.log('OAuth2 Client ID not found in environment variables.');
    clientId = await prompt('Enter your OAuth2 Client ID: ');
  } else {
    console.log('✓ Using OAuth2 Client ID from environment variables');
  }

  if (!clientSecret) {
    console.log('OAuth2 Client Secret not found in environment variables.');
    clientSecret = await prompt('Enter your OAuth2 Client Secret: ');
  } else {
    console.log('✓ Using OAuth2 Client Secret from environment variables');
  }

  if (!clientId || !clientSecret) {
    throw new Error('Client ID and Client Secret are required');
  }

  return { clientId, clientSecret };
}

/**
 * Builds the OAuth2 authorization URL
 */
function getAuthorizationUrl(clientId: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline', // Required to get refresh token
    prompt: 'consent', // Force consent screen to ensure refresh token
  });

  return `${AUTH_URL}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access and refresh tokens
 */
async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Starts a local HTTP server to handle the OAuth2 callback
 */
function startCallbackServer(
  clientId: string,
  clientSecret: string
): Promise<TokenResponse> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (!req.url) {
        return;
      }

      const url = new URL(req.url, `http://localhost:${PORT}`);

      if (url.pathname === '/oauth2callback') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #d32f2f;">Authorization Failed</h1>
                <p>Error: ${error}</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          reject(new Error(`Authorization failed: ${error}`));
          return;
        }

        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #d32f2f;">Invalid Response</h1>
                <p>No authorization code received.</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          reject(new Error('No authorization code received'));
          return;
        }

        try {
          console.log('\n✓ Authorization code received');
          console.log('→ Exchanging code for tokens...');

          const tokens = await exchangeCodeForTokens(code, clientId, clientSecret);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #4caf50;">✓ Success!</h1>
                <p style="font-size: 18px;">Your refresh token has been generated.</p>
                <p style="color: #666;">Check your terminal for the token details.</p>
                <p style="margin-top: 40px;">You can close this window.</p>
              </body>
            </html>
          `);

          server.close();
          resolve(tokens);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #d32f2f;">Token Exchange Failed</h1>
                <p>${err instanceof Error ? err.message : 'Unknown error'}</p>
                <p>Check your terminal for more details.</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          reject(err);
        }
      }
    });

    server.listen(PORT, () => {
      console.log(`\n✓ Local server started on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      reject(new Error(`Failed to start server: ${err.message}`));
    });
  });
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Get credentials
    const { clientId, clientSecret } = await getCredentials();

    // Build authorization URL
    const authUrl = getAuthorizationUrl(clientId);

    console.log('\n=== Starting OAuth2 Flow ===\n');
    console.log('Step 1: Starting local callback server...');

    // Start the callback server
    const tokenPromise = startCallbackServer(clientId, clientSecret);

    console.log('Step 2: Opening browser for authorization...');
    console.log('\nIf your browser does not open automatically, visit this URL:');
    console.log(`\n${authUrl}\n`);

    // Try to open the browser with timeout
    const browserTimeout = setTimeout(() => {
      console.log('⚠ Browser open timed out after 10 seconds');
      console.log('→ If browser did not open, please manually open the URL above');
    }, 10000);

    try {
      await Promise.race([
        open(authUrl),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Browser open timeout')), 15000)
        )
      ]);
      clearTimeout(browserTimeout);
      console.log('✓ Browser opened');
    } catch (err) {
      clearTimeout(browserTimeout);
      if (err instanceof Error && err.message === 'Browser open timeout') {
        console.log('⚠ Browser open timed out');
      } else {
        console.log('⚠ Could not automatically open browser');
      }
      console.log('→ Please manually open the URL above');
    }

    console.log('\nStep 3: Waiting for authorization...');
    console.log('→ Please sign in and authorize the application in your browser');

    // Wait for the callback
    const tokens = await tokenPromise;

    // Display the results
    console.log('\n=== ✓ SUCCESS ===\n');
    console.log('Your Google Ads API refresh token has been generated!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nREFRESH TOKEN:');
    console.log(tokens.refresh_token);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Additional Details:');
    console.log(`- Access Token: ${tokens.access_token.substring(0, 20)}...`);
    console.log(`- Token Type: ${tokens.token_type}`);
    console.log(`- Expires In: ${tokens.expires_in} seconds`);
    console.log(`- Scope: ${tokens.scope}\n`);

    console.log('Next Steps:');
    console.log('1. Save your refresh token in a secure location');
    console.log('2. Add it to your .env file as GOOGLE_ADS_REFRESH_TOKEN');
    console.log('3. Never commit the refresh token to version control\n');

    console.log('Example .env entry:');
    console.log(`GOOGLE_ADS_REFRESH_TOKEN=${tokens.refresh_token}\n`);

  } catch (err) {
    console.error('\n❌ Error:', err instanceof Error ? err.message : 'Unknown error');
    console.error('\nTroubleshooting:');
    console.error('1. Ensure your OAuth2 credentials are correct');
    console.error('2. Check that http://localhost:3001/oauth2callback is added as a redirect URI');
    console.error('3. Verify the Google Ads API is enabled in your project');
    console.error('4. Make sure port 3001 is not already in use\n');
    process.exit(1);
  }
}

// Run the script
main();
