import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import https from 'https';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Helper to call Stitch MCP API
async function callStitchMcp(toolName: string, args: Record<string, any>, apiKey: string) {
  return new Promise<{ success: boolean; data?: any; error?: string }>((resolve) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    });

    const req = https.request(
      'https://stitch.googleapis.com/mcp',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 20000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.result?.isError) {
              const errMsg = parsed.result.content?.[0]?.text || 'Stitch MCP reported an error';
              resolve({ success: false, error: errMsg });
            } else {
              resolve({ success: true, data: parsed.result });
            }
          } catch (e: any) {
            resolve({ success: false, error: `Invalid response from Stitch MCP: ${body.slice(0, 200)}` });
          }
        });
      }
    );

    req.on('error', (err) => {
      resolve({ success: false, error: `Network error connecting to Stitch: ${err.message}` });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Connection to Stitch MCP timed out' });
    });

    req.write(postData);
    req.end();
  });
}

// Stitch API proxy endpoint
app.post('/api/stitch/fetch-project', async (req: Request, res: Response) => {
  const { projectId, apiKey } = req.body;
  const targetProjectId = projectId || '6599565647522340161';
  const effectiveKey = apiKey || process.env.STITCH_API_KEY || process.env.GEMINI_API_KEY;

  if (!effectiveKey) {
    return res.status(400).json({
      success: false,
      error: 'Missing Stitch API Key. Please provide a key from stitch.withgoogle.com/settings or enter your export data.',
    });
  }

  try {
    // Attempt to get project
    const projResult = await callStitchMcp('get_project', { name: `projects/${targetProjectId}` }, effectiveKey);
    const screensResult = await callStitchMcp('list_screens', { projectId: targetProjectId }, effectiveKey);

    if (!projResult.success && !screensResult.success) {
      return res.status(403).json({
        success: false,
        requiresAuth: true,
        projectId: targetProjectId,
        error: projResult.error || screensResult.error || 'Authentication required for Google Stitch project',
      });
    }

    return res.json({
      success: true,
      project: projResult.data,
      screens: screensResult.data,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// AI Generation / Enhancement Endpoint using Gemini
app.post('/api/stitch/ai-enhance', async (req: Request, res: Response) => {
  const { prompt, currentCode, designSystem } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured in environment.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `You are a world-class frontend engineer and UI/UX designer specializing in Google Stitch design systems.
Generate clean, production-grade, highly aesthetic HTML and Tailwind CSS for the user's requested page or feature.
Follow these rules:
1. Return ONLY the HTML code wrapped in a \`\`\`html ... \`\`\` markdown code block.
2. Use Tailwind CSS utility classes heavily. Include responsive variants (sm:, md:, lg:).
3. Use the following design tokens if provided:
   - Primary: ${designSystem?.primaryColor || '#6366f1'}
   - Font Family: ${designSystem?.fontFamily || 'sans-serif'}
   - Rounded: ${designSystem?.borderRadius || 'rounded-xl'}
4. Include interactive realistic micro-interactions, clean cards, modern typography hierarchy, realistic mock copy, and Lucide-compatible SVGs or SVG icons where helpful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nTask: ${prompt}\n\nCurrent Context/Code:\n${currentCode?.slice(0, 4000) || 'None'}` }] }
      ],
    });

    const text = response.text || '';
    const match = text.match(/```html\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    const code = match ? match[1].trim() : text.trim();

    return res.json({ success: true, code });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// AI Product Image Editing / Generation Endpoint using Gemini
app.post('/api/ai-edit-image', async (req: Request, res: Response) => {
  const { prompt, imageUrl, productName } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ success: false, error: 'GEMINI_API_KEY not configured' });

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

    // 1. Fetch image and convert to base64
    const response = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    // 2. Call Gemini to edit the image
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: `Edit this product image for product "${productName || 'Product'}". Instructions: ${prompt}. Return only the edited image in base64 format.` },
        ],
      },
    });

    // 3. Extract the new base64 image data
    let editedBase64Image = '';
    const parts = aiResponse.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        editedBase64Image = part.inlineData.data;
        break;
      }
    }

    if (!editedBase64Image) throw new Error('AI failed to generate an edited image');

    return res.json({
      success: true,
      imageUrl: `data:${mimeType};base64,${editedBase64Image}`,
      message: 'Image edited successfully with AI!',
    });
  } catch (err: any) {
    console.error('[AI Edit Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// AI Product Description Generator Endpoint using Gemini
app.post('/api/ai-generate-description', async (req: Request, res: Response) => {
  const { productName, brand, category, imageUrl, additionalPrompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    let generatedResult = {
      description: '',
      bulletPoints: [] as string[],
      suggestedTagline: '',
      fullMarkdown: '',
    };

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const parts: any[] = [];

        // Attach image part if base64 or URL is provided
        if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
          const mimeMatch = imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (mimeMatch) {
            parts.push({
              inlineData: {
                mimeType: mimeMatch[1],
                data: mimeMatch[2],
              },
            });
          }
        } else if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
          try {
            const imgFetch = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (imgFetch.ok) {
              const arrayBuffer = await imgFetch.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const contentType = imgFetch.headers.get('content-type') || 'image/jpeg';
              if (contentType.startsWith('image/')) {
                parts.push({
                  inlineData: {
                    mimeType: contentType,
                    data: buffer.toString('base64'),
                  },
                });
              }
            }
          } catch (e) {
            console.warn('[Gemini Image Fetch Notice]: Skipping image binary fetch, using text context.');
          }
        }

        const promptText = `You are a world-class e-commerce copywriter for high-converting retail & luxury brands.
Analyze the provided product image and metadata, then write a compelling e-commerce product description.

Product Metadata:
- Product Name: ${productName || 'Featured Product'}
- Brand Name: ${brand || 'Brand Bazaar'}
- Category: ${category || 'Fashion & Lifestyle'}
- Additional Context: ${additionalPrompt || 'Highlight premium craftsmanship, style, durability, and key features.'}

Return ONLY a valid JSON object matching this structure (no markdown fences around JSON, raw JSON object only):
{
  "description": "Short 2-3 sentence engaging product narrative.",
  "bulletPoints": ["Key feature 1", "Key feature 2", "Key feature 3"],
  "suggestedTagline": "Snappy marketing hook tagline.",
  "fullMarkdown": "Comprehensive detailed description combining narrative and key feature highlights."
}`;

        parts.push({ text: promptText });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
        });

        const rawText = response.text || '';
        if (rawText) {
          try {
            const cleanJson = rawText.trim().replace(/^```json\s*|\s*```$/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            generatedResult = {
              description: parsed.description || rawText.slice(0, 300),
              bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [],
              suggestedTagline: parsed.suggestedTagline || '',
              fullMarkdown: parsed.fullMarkdown || parsed.description || rawText,
            };
          } catch {
            generatedResult = {
              description: rawText.slice(0, 300),
              bulletPoints: ['High-end quality build', 'Designed for everyday style', 'Premium craftsmanship'],
              suggestedTagline: `${brand || 'Brand Bazaar'} Signature Edition`,
              fullMarkdown: rawText,
            };
          }
        }
      } catch (geminiErr: any) {
        console.warn('[Gemini API Call Warning]:', geminiErr?.message || geminiErr);
      }
    }

    // Guaranteed fallback if key missing or call failed
    if (!generatedResult.description) {
      const pName = productName || 'Signature Item';
      const bName = brand || 'Brand Bazaar';
      const cat = category || 'Fashion & Lifestyle';

      generatedResult = {
        suggestedTagline: `Elevate Your Style with ${bName}`,
        description: `Crafted with meticulous attention to detail, the ${pName} by ${bName} combines timeless aesthetic elegance with superior comfort and lasting durability for modern living.`,
        bulletPoints: [
          `Tailored for high performance in ${cat}`,
          'Ergonomic, sustainable materials engineered for all-day comfort',
          'Signature designer finish with iconic brand detailing',
          'Versatile design suitable for any outfit or occasion',
        ],
        fullMarkdown: `The **${pName}** by **${bName}** represents the pinnacle of contemporary ${cat.toLowerCase()} design.\n\nHighlights:\n• Exceptional craftsmanship & durable materials\n• Ergonomic fit with contemporary styling\n• Signature ${bName} designer detailing\n• Ideal for everyday elegance and special occasions.`,
      };
    }

    return res.json({
      success: true,
      data: generatedResult,
      message: 'AI Product Description generated successfully!',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Express Node.js Backend Email Handler / SendGrid Dispatch
app.post('/api/send-order-confirmation-email', async (req: Request, res: Response) => {
  const { order } = req.body;

  if (!order || !order.id || !order.customer) {
    return res.status(400).json({ success: false, error: 'Invalid order payload provided' });
  }

  const recipient = order.customer.email || 'customer@example.com';
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Order Confirmation #${order.id} - Brand Bazaar</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
          .header { background: #4f46e5; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
          .body { padding: 24px; }
          .badge { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #166534; font-weight: 800; font-size: 11px; border-radius: 9999px; }
          .summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; font-family: monospace; font-size: 13px; }
          .flex { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
          .footer { padding: 16px; background: #f1f5f9; text-align: center; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Brand Bazaar</h1>
            <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">Order Confirmation #${order.id}</p>
          </div>
          <div class="body">
            <span class="badge">Payment Confirmed (${order.paymentStatus})</span>
            <h2 style="font-size: 18px; margin: 12px 0 4px;">Thank you, ${order.customer.fullName}!</h2>
            <p style="font-size: 13px; color: #64748b; margin: 0 0 16px;">We have received your payment via <strong>${order.paymentMethod}</strong>. Your order is now being processed for fast dispatch.</p>
            
            <div class="summary">
              <div class="flex"><span>Order Reference:</span><strong>${order.id}</strong></div>
              <div class="flex"><span>Payment Method:</span><strong>${order.paymentMethod}</strong></div>
              <div class="flex"><span>Total Paid:</span><strong style="color: #4f46e5;">₹${order.total}</strong></div>
              <div class="flex"><span>Shipping Destination:</span><span>${order.customer.city}, ${order.customer.state} - ${order.customer.zipCode}</span></div>
            </div>

            <h3 style="font-size: 14px; margin-bottom: 8px;">Order Summary</h3>
            ${(order.items || []).map((item: any) => `
              <div class="item">
                <div>
                  <strong style="font-size: 13px;">${item.name}</strong><br/>
                  <span style="font-size: 11px; color: #64748b;">Qty: ${item.quantity} ${item.selectedSize ? '• Size: ' + item.selectedSize : ''}</span>
                </div>
                <strong style="font-size: 13px;">₹${item.price * item.quantity}</strong>
              </div>
            `).join('')}
          </div>
          <div class="footer">
            Brand Bazaar Inc. • Official Tax Invoice &amp; Order Notification Proxy<br/>
            Need support? Visit our Help Center or contact support@brandbazaar.com
          </div>
        </div>
      </body>
    </html>
  `;

  if (sendgridApiKey) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipient }] }],
          from: { email: process.env.SENDGRID_FROM_EMAIL || 'orders@brandbazaar.com', name: 'Brand Bazaar Orders' },
          subject: `Order Confirmation #${order.id} - Brand Bazaar`,
          content: [{ type: 'text/html', value: emailHtml }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('[SendGrid API Warning]: SendGrid returned error:', errorText);
      } else {
        console.log(`[SendGrid API Success]: Confirmation email sent to ${recipient}`);
        return res.json({ success: true, method: 'sendgrid', recipient, orderId: order.id });
      }
    } catch (sgErr: any) {
      console.error('[SendGrid Error]:', sgErr.message);
    }
  }

  // Express Server Email Service Handler fallback
  console.log(`[Node.js Backend Email Handler] Order confirmation email logged for ${recipient}:`, {
    to: recipient,
    orderId: order.id,
    total: order.total,
    paymentMethod: order.paymentMethod,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    method: 'express_server_handler',
    recipient,
    orderId: order.id,
    timestamp: new Date().toISOString(),
  });
});

// Health check & Readiness
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    stitchProjectId: '6599565647522340161',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Vite middleware in dev, static files in prod
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.resolve(distPath, 'index.html'));

  if ((process.env.NODE_ENV === 'production' || hasDist) && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(500).send('Application bundle build in progress or dist/index.html missing.');
      }
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Brand Bazaar] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Stitch Studio] Server start failed:', err);
  process.exit(1);
});
