import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables from the root .env
dotenv.config({ path: '../../.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

app.post('/api/redact', async (req, res) => {
  try {
    const { prompt, base64 } = req.body;
    const apiKey = process.env.HF_TOKEN;

    if (!apiKey) {
      return res.status(500).json({ error: 'HF_TOKEN not configured' });
    }

    const model = 'Qwen/Qwen2.5-VL-72B-Instruct';
    const endpoint = 'https://router.huggingface.co/v1/chat/completions';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s for vision tasks

    const requestBody = {
      model: 'Qwen/Qwen2.5-VL-72B-Instruct',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
        ]
      }]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify(requestBody)
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API Error Response:', errorText);
      return res.status(response.status).json({ error: `HF API error: ${response.status}`, details: errorText });
    }

    const data = await response.json();
    data.choices?.[0]?.message?.content || '';
    res.json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out.');
      return res.status(504).json({ error: 'AI request timed out. The image might be too complex or the model is overloaded.' });
    }
    console.error('Redact error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.listen(port, () => {
  console.log(`Redactor package running at http://localhost:${port}`);
});
