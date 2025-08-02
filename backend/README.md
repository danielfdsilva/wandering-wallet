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
   cp example.env .env
   ```

5. Edit `.env` to set the following variables (use file paths for config and credentials):
   ```
   PORT=3001
   APP_CONFIG_PATH=./app-config.json
   GOOGLE_SERVICE_ACCOUNT_JSON=./client_secret_xxx.json
   GOOGLE_CLIENT_ID=your_oauth_client_id_here
   ```

   - `APP_CONFIG_PATH`: Path to your backend config file (e.g., `./app-config.json`)
   - `GOOGLE_SERVICE_ACCOUNT_JSON`: Path to your Google service account JSON file
   - `GOOGLE_CLIENT_ID`: Your OAuth 2.0 Client ID

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
