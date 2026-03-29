# MatchMyCV

MatchMyCV is a two-app project that uploads a PDF resume, extracts structured resume data, matches that data against available jobs, and returns scored job recommendations.

## Project Overview

The app is split into:

- `client`: a React + Vite frontend for uploading resumes and viewing parsed results
- `server`: a Node.js + Express backend for PDF parsing, job fetching, and match scoring

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- File upload: Multer
- PDF text extraction: `pdf-parse`
- Config loading: `dotenv`

## Folder Structure

```text
MatchMyCV/
|-- client/
|   |-- src/
|   |   |-- services/
|   |   |   `-- api.js
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .env
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- services/
|   |   |   |-- jobService.js
|   |   |   |-- matcher.js
|   |   |   `-- resumeParser.js
|   |   |-- utils/
|   |   |   `-- uploadValidation.js
|   |   |-- app.js
|   |   `-- index.js
|   |-- .env
|   `-- package.json
`-- README.md
```

## Setup Instructions

Requirements:

- Node.js 20+ recommended
- npm

Install dependencies:

```bash
cd server
npm install
```

```bash
cd client
npm install
```

## How To Run Server

From the project root:

```bash
cd server
npm run dev
```

The server runs on `http://localhost:4000` by default.

## How To Run Client

From the project root:

```bash
cd client
npm run dev
```

The client runs on `http://localhost:5173` by default.

## Environment Variables Needed

### Server: `server/.env`

```env
PORT=4000
CLIENT_URL=http://localhost:5173
JOB_API_URL=
JOB_API_KEY=
```

- `PORT`: backend port
- `CLIENT_URL`: allowed frontend origin for local CORS
- `JOB_API_URL`: optional external jobs API endpoint
- `JOB_API_KEY`: optional bearer token for the jobs API

### Client: `client/.env`

```env
VITE_API_URL=http://localhost:4000
```

- `VITE_API_URL`: backend base URL used by the frontend upload request

## How The App Works

1. The user uploads a PDF resume from the frontend.
2. The client sends the file to `POST /upload` on the backend.
3. The backend validates the file and extracts text from the PDF.
4. The resume parser converts the text into structured JSON:
   - skills
   - experience
   - jobTitles
   - education
   - languages
5. The job service returns jobs from an external API when configured, or falls back to realistic mock job data.
6. The matcher service scores each job out of 100 and labels it as:
   - High Probability
   - Medium Probability
   - Stretch
7. The frontend displays the parsed resume summary and matched job results with sorting and filtering controls.

## Verification Checklist

- Start the server with `npm run dev` inside `server`
- Start the client with `npm run dev` inside `client`
- Open the client in the browser
- Upload a PDF resume
- Confirm parsed resume fields appear
- Confirm matched jobs appear with fit scores, categories, and links
