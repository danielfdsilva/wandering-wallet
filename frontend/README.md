# Wandering Wallet Frontend

This is the React + Vite frontend for Wandering Wallet, a web application to track trip expenses with Google authentication and Google Sheets integration.

## Features

- Google OAuth 2.0 authentication
- Expense entry form with amount and description
- Real-time feedback on submission status
- Connects to a Node.js backend for Google Sheets integration

## Prerequisites

- Node.js v24 or higher
- The backend server running (see root README for backend setup)
- Google OAuth 2.0 Client ID

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration:
   ```
   VITE_API_URL=http://localhost:3001
   ```

## Running the Frontend

Start the development server:
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

## Deployment

You can build the frontend for production:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Docker

A Dockerfile is provided for containerized builds. See the root README for Docker usage.

## Technologies Used

- React
- Vite
- Chakra UI
- Google OAuth 2.0

## Project Structure

- `src/components/` – React components
- `src/contexts/` – React context providers
- `src/styles/` – Theme and styles

For backend setup and full-stack deployment, refer to the main [README.md](../README.md).
