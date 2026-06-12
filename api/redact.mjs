const endpoint = 'https://router.huggingface.co/v1/chat/completions';
const model = 'Qwen/Qwen2.5-VL-72B-Instruct';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, base64 } = req.body || {};
    const apiKey = process.env.HF_TOKEN;

    if (!apiKey) {
      return res.status(500).json({ error: 'HF_TOKEN not configured' });
    }

    if (!prompt || !base64) {
      return res.status(400).json({ error: 'Missing prompt or base64 image data' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } },
            ],
          },
        ],
      }),
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      const details = await response.text();
      return res.status(response.status).json({
        error: `HF API error: ${response.status}`,
        details,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'AI request timed out. The image might be too complex or the model is overloaded.',
      });
    }

    return res.status(500).json({ error: error.message });
  }
}
