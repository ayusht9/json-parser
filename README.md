# AeroJSON — JSON Parser & API Simulator

A professional, dark-themed **JSON parsing and API testing workbench** built with **React + Vite** on the frontend and **Node.js + Express** on the backend.

---

## Features

- **JSON Editor** — Syntax-aware textarea with line numbers, Format/Minify/Copy/Clear actions, wrap toggle, and collapsible dock
- **Interactive Tree Visualizer** — Recursive JSON tree with dashed guide lines, Expand All / Collapse All, hover JSONPath badges, and one-click copy of paths or values
- **Data Grid** — Tabular view supporting deeply nested arrays, sub-tables, pagination, and CSV export
- **Swagger-like Spec Docs** — Auto-inferred schema, endpoint metadata, and model descriptions from your JSON
- **JSON Tools** — JSONPath query runner, YAML/XML converters, object flattener
- **API Sandbox** — Fire real HTTP requests to a mock Express endpoint with configurable method, status code, and latency
- **Code Snippets** — Auto-generated cURL, JavaScript, Python, and TypeScript code for your JSON payload
- **Resizable split panes** — Drag the divider to resize editor vs visualizer; collapse either side into a slim dock
- **Light / Dark theme toggle**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Backend | Node.js, Express 5 |
| Styling | Vanilla CSS (custom design system) |
| Container | Docker (multi-stage build) |

---

## Local Development

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server (frontend only, with HMR)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Start the Express API server (backend only)
```bash
npm run server
```
Runs on [http://localhost:5000](http://localhost:5000)

### 4. Build for production
```bash
npm run build
```
Outputs compiled assets to `dist/`.

### 5. Serve the production build locally
```bash
npm run server
```
The Express server serves `dist/` statically and handles API routes at `/api/mock`.  
Open [http://localhost:5000](http://localhost:5000)

---

## Docker Deployment

### Prerequisites
- **Docker** ≥ 20
- **Docker Compose** ≥ 2 (optional but recommended)

### Build & run with Docker Compose (recommended)
```bash
docker compose up --build
```
Open [http://localhost:5000](http://localhost:5000)

To run in the background:
```bash
docker compose up --build -d
```

To stop:
```bash
docker compose down
```

---

### Build & run with plain Docker
```bash
# Build the image
docker build -t aerojson .

# Run the container
docker run -p 5000:5000 aerojson
```

To override the port:
```bash
docker run -p 8080:8080 -e PORT=8080 aerojson
```

---

### Docker build stages

The `Dockerfile` uses a **multi-stage build** to keep the final image lean:

| Stage | Base | What it does |
|---|---|---|
| `builder` | `node:20-alpine` | Installs all deps, runs `npm run build` → produces `dist/` |
| `runtime` | `node:20-alpine` | Installs prod deps only, copies `dist/` + `server.js`, starts Express |

The final image contains **no source code, no Vite, no dev toolchain** — just the compiled frontend and the Express server.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |
| `NODE_ENV` | `production` | Node environment |

---

## Project Structure

```
json_parser/
├── src/
│   ├── App.jsx          # Main React application (all components)
│   ├── index.css        # Design system & component styles
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── server.js            # Express server (API + static serving)
├── vite.config.js       # Vite configuration
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Docker Compose deployment config
├── .dockerignore        # Docker build context exclusions
└── package.json
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build React app for production |
| `npm run server` | Start Express production server |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the Vite production build |
