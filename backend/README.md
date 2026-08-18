# Wandering Wallet Backend

This is the Node.js + Express backend for Wandering Wallet, responsible for handling authentication, expense submissions, and integration with Google Sheets.

## Features

- Google OAuth 2.0 authentication and email restriction
- Receives and validates expense submissions from the frontend
- Stores expenses in a Google Sheet via the Google Sheets API

## Prerequisites

- Node.js v24 or higher
- A Google Cloud Project with Sheets API and OAuth 2.0 enabled
- Google Service Account credentials JSON file
- Backend configuration file (`app-config.json`)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a configuration file:
   - Copy `app-config-example.json` to `app-config.json`
   - Edit `app-config.json` to set your Google Sheet ID, allowed emails, and other settings

3. Prepare your Google Service Account credentials file (downloaded from Google Cloud Console).

4. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` to set the following variables:
   ```
   PORT=3001
   GOOGLE_CLIENT_ID=your_oauth_client_id_here
   GOOGLE_SHEET_ID=your_google_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_FILE=./google-service-account.json
   APP_CONFIG_FILE=./app-config.json
   JWT_SECRET=your_secret_here
   ```

   - `GOOGLE_CLIENT_ID`: Your OAuth 2.0 Client ID
   - `GOOGLE_SHEET_ID`: The ID of the Google Sheet used to store expenses
   - `GOOGLE_SERVICE_ACCOUNT_FILE`: Path to your Google service account JSON file (alias: `GOOGLE_SERVICE_ACCOUNT_JSON`)
   - `APP_CONFIG_FILE`: Path to your backend config file (alias: `APP_CONFIG_PATH`)
   - `JWT_SECRET`: Secret used to sign session tokens — generate one with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```

## Running the Backend

Start the backend server:
```bash
npm run dev
```
The server will run on the port specified in `.env` (default: 3001).

## Deployment

A Dockerfile is provided for containerized deployment. Pass the required environment variables and mount the config and credentials files as needed.

## Project Structure

- `server.js` – Main entry point
- `routes/` – API routes
- `middleware/` – Authentication and other middleware
- `app-config.json` – Application configuration (see example)
