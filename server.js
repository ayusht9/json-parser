import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve React production build files
app.use(express.static(path.join(__dirname, 'dist')));

// API Sandbox Mock Endpoint
app.post('/api/mock', (req, res) => {
  const { method, latency, status, payload } = req.body;
  const simulatedLatency = parseInt(latency) || 0;
  const statusCode = parseInt(status) || 200;

  setTimeout(() => {
    res.status(statusCode);

    let responseBody = {};
    if (statusCode === 200 || statusCode === 201) {
      if (method === 'GET') {
        responseBody = Array.isArray(payload) ? payload : [payload];
      } else {
        responseBody = {
          success: true,
          id: `id_${Math.floor(Math.random() * 89999 + 10000)}`,
          created_at: new Date().toISOString(),
          echo_payload: payload || { message: "Empty payload received" }
        };
      }
    } else {
      const errorMessages = {
        400: "Bad Request: The requested JSON payload failed validation requirements.",
        401: "Unauthorized: Authentication credentials missing or invalid token signature.",
        403: "Forbidden: Your API token lacks required authorization scopes.",
        404: "Not Found: The mock endpoint resource could not be found.",
        500: "Internal Server Error: Simulated runtime error occurred in backend container pool."
      };
      responseBody = {
        error: errorMessages[statusCode] ? errorMessages[statusCode].split(': ')[0] : "Error",
        message: errorMessages[statusCode] ? errorMessages[statusCode].split(': ')[1] : "An error occurred."
      };
    }

    res.json(responseBody);
  }, simulatedLatency);
});

// Fallback to client-side routing in prod
app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node Express Server running on port ${PORT}`);
});
