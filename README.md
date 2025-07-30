# Wandering Wallet

A web application to track trip expenses using a React frontend and Node.js backend, with automatic storage to Google Sheets.

## Features

- Google Authentication with email restriction
- Simple expense entry form with amount and description
- Automatic timestamp recording
- Direct integration with Google Sheets
- Real-time feedback on submission status

## Project Structure

```
trip-expenses/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── expense-form.jsx
│   │   ├── app.jsx
│   │   ├── app.css
│   │   └── main.jsx
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── server.js
│   ├── package.json
│   └── .env
└── Dockerfile         # Multi-stage Docker build file
```

## Prerequisites

- Node.js v24 or higher (an `.nvmrc` file is included for nvm users)
- A Google Cloud Project with the following APIs enabled:
  - Google Sheets API
  - Google OAuth 2.0
- A Google Service Account with access to Sheets API
- A Google OAuth 2.0 Client ID for authentication

## Setup Instructions

### 1. Node.js Setup

If you use nvm (Node Version Manager), simply run:
```bash
nvm use
```
This will automatically switch to Node.js 24 as specified in the `.nvmrc` file.

If you don't use nvm, ensure you have Node.js 24 or higher installed manually.

### 2. Google Cloud Setup

#### Google Sheets Configuration

1. Create a new Google Sheet
2. Note down the Sheet ID from the URL (the long string between /d/ and /edit)
3. Set up Google Cloud Project:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google Sheets API
   - Create a Service Account
   - Download the JSON credentials
   - Share your Google Sheet with the service account email

#### Google OAuth Configuration

1. Set up OAuth 2.0:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to your project
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" and select "OAuth client ID"
   - Select "Web application" as the application type
   - Add your application's domain to the authorized JavaScript origins
   - Add your application's redirect URI (e.g., http://localhost:5173 for development)
   - Note down the Client ID

2. Configure Authorized Users:
   - The application is configured to only allow access to specific email addresses
   - Currently authorized: danielfdsilva@gmail.com
   - To modify the allowed emails, update the ALLOWED_EMAILS array in `backend/middleware/auth.js`

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp example.env .env
   ```

4. Update `.env` with your Google credentials:
   ```
   PORT=3001
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY="your_private_key_here"
   GOOGLE_CLIENT_ID=your_oauth_client_id_here
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   VITE_API_URL=http://localhost:3001
   VITE_GOOGLE_CLIENT_ID=your_oauth_client_id_here
   ```

## Running the Application

1. Start the backend server (in the backend directory):
   ```bash
   npm run dev
   ```

2. Start the frontend development server (in the frontend directory):
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`
4. Sign in using your Google account (must be an authorized email)

## Usage

1. Sign in with your Google account (must be danielfdsilva@gmail.com)
2. Enter the expense amount in the "Amount" field
2. Provide a description for the expense
3. Click "Add Expense" to submit
4. The expense will be automatically added to your Google Sheet with a timestamp

## Development

- Backend runs on port 3001 by default
- Frontend development server runs on port 5173
- Hot reload is enabled for both frontend and backend

## Docker Deployment

You can run the entire application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t trip-expenses .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 \
     -e PORT=3001 \
     -e GOOGLE_SHEET_ID=your_sheet_id \
     -e GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email \
     -e GOOGLE_PRIVATE_KEY="your_private_key" \
     -e GOOGLE_CLIENT_ID=your_oauth_client_id \
     trip-expenses
   ```

The application will be available at `http://localhost:3001`.

### Environment Variables

When running with Docker, pass all required environment variables using the `-e` flag:
- `PORT`: The port to run the server (default: 3001)
- `GOOGLE_SHEET_ID`: Your Google Sheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Your service account email
- `GOOGLE_PRIVATE_KEY`: Your service account private key
- `GOOGLE_CLIENT_ID`: Your OAuth 2.0 Client ID

## Technologies Used

- Frontend:
  - React
  - Vite
  - Chakra UI
  - Google OAuth 2.0

- Backend:
  - Node.js
  - Express
  - google-spreadsheet
  - dotenv
  - cors

- Deployment:
  - Docker
  - Multi-stage builds
