# Name Classification API

A simple Express API that predicts gender from a first name using the public [Genderize API](https://genderize.io/).

It validates input, calls the external API, and returns a normalized response with confidence metadata.

## Features

- Single endpoint for name classification
- Input validation for query parameters
- External API integration with `axios`
- CORS enabled
- Consistent JSON response shape

## Tech Stack

- Node.js
- Express
- Axios
- Dotenv
- Nodemon (dev)

## Project Structure

```text
src/
	app.js
	server.js
	controllers/
		classify.controller.js
	routes/
		classify.routes.js
	services/
		genderize.service.js
	utils/
		validator.js
```

## Prerequisites

- Node.js 18+ recommended
- npm

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The server starts on:

- `http://localhost:3000` by default
- or `PORT` from `.env`

Example `.env` file:

```env
PORT=3000
GENDERIZE_API_KEY=
```

## API Reference

### GET `/api/classify`

Predicts gender for a given name.

#### Query Parameters

- `name` (required, string): The first name to classify

#### Success Response (`200`)

```json
{
	"status": "success",
	"data": {
		"name": "alex",
		"gender": "male",
		"probability": 0.88,
		"sample_size": 1200,
		"is_confident": true,
		"processed_at": "2026-04-16T10:00:00.000Z"
	}
}
```

`is_confident` is `true` when:

- `probability >= 0.7`
- `sample_size >= 100`

#### Error Responses

`400 Bad Request`:

```json
{
	"status": "error",
	"message": "Name query parameter is required"
}
```

or

```json
{
	"status": "error",
	"message": "Name cannot be empty"
}
```

or

```json
{
	"status": "error",
	"message": "No prediction available for the provided name"
}
```

`422 Unprocessable Entity`:

```json
{
	"status": "error",
	"message": "Name must be a string"
}
```

`502 Bad Gateway`:

```json
{
	"status": "error",
	"message": "External API error (502)"
}
```

`503 Service Unavailable`:

```json
{
	"status": "error",
	"message": "Genderize rate limit reached. Try again later or add GENDERIZE_API_KEY."
}
```

`504 Gateway Timeout`:

```json
{
	"status": "error",
	"message": "External API timeout"
}
```

## Example Requests

PowerShell:

```powershell
Invoke-RestMethod "http://localhost:3000/api/classify?name=alex"
```

curl:

```bash
curl "http://localhost:3000/api/classify?name=alex"
```

## Notes

- This service depends on `https://api.genderize.io` availability.
- Current CORS configuration allows all origins (`*`).
- If you hit rate limits in production, set `GENDERIZE_API_KEY`.

## Deployment

### Render (Web Service)

1. Push this project to GitHub.
2. In Render, create a new **Web Service** and connect the repository.
3. Use these settings:
	 - Runtime: Node
	 - Build Command: `npm install`
	 - Start Command: `node src/server.js`
4. Add environment variables if needed (for example `PORT`, though Render usually provides it automatically).
5. Deploy.

After deploy, test:

```bash
curl "https://<your-render-url>/api/classify?name=alex"
```

### Vercel (Serverless)

Because this project uses an Express app plus a separate `server.js` listener, Vercel should run the app through a serverless function entrypoint.

1. Add `api/index.js`:

```js
const app = require('../src/app');

module.exports = app;
```

2. Add `vercel.json`:

```json
{
	"version": 2,
	"rewrites": [
		{
			"source": "/(.*)",
			"destination": "/api/index.js"
		}
	]
}
```

3. Import the repository in Vercel (or run `vercel` from the project directory).
4. Deploy to production.

After deploy, test:

```bash
curl "https://<your-vercel-url>/api/classify?name=alex"
```

### Deployment Tips

- Keep `src/server.js` for local/dev runtime (`npm run dev`).
- Vercel uses the serverless function (`api/index.js`) and does not need `app.listen(...)`.
- If your frontend is hosted on a different domain, replace open CORS (`*`) with an allowlist.

### Troubleshooting `External API error`

If production returns `{"status":"error","message":"External API error"}`:

1. Check your Render/Vercel logs to see upstream status and error details.
2. Retry the direct upstream call:
	- `https://api.genderize.io/?name=alex`
3. If upstream returns `429`, configure `GENDERIZE_API_KEY` in your deployment environment.
4. Redeploy after updating environment variables.
