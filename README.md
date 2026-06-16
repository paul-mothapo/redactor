# Image Redactor

Ever needed to blur out your face or hide your ID number before posting something online? Yeah. This does that.

Upload any image - ID card, passport, screenshot, whatever - and the AI finds all the sensitive stuff (faces, names, addresses, barcodes, you name it). One click and it's redacted. Done. No Photoshop. No overthinking it.

You can also just draw boxes manually if you don't trust the AI. Fair enough.

## What it does

- **AI detection** — Qwen2.5-VL-72B vision model scans your image and finds faces, names, ID numbers, dates, signatures, barcodes… basically anything you'd want hidden
- **Manual mode** — Don't want AI? Just click and drag to draw your own redaction boxes
- **Keyboard friendly** — Arrow keys to move, Shift+arrows to resize, Enter to drop a box. Full keyboard access
- **Three styles** — Black cover, white cover, or blur. Pick your vibe
- **Ghost suggestions** — AI detections show up as dashed outlines. Confirm the ones you want, reject the rest
- **Undo** — Made a mistake? Step back. Multiple times if needed
- **Download** — Export as PNG when you're happy with it
- **Responsive** — Works on whatever screen size you throw at it

## Tech stack

| What      | How                                                         |
| --------- | ----------------------------------------------------------- |
| Frontend  | Vanilla HTML / CSS / JS + HTML5 Canvas. No framework. Raw.  |
| Backend   | Node.js + Express (dev) · Vercel Serverless (prod)          |
| AI        | Qwen/Qwen2.5-VL-72B-Instruct via Hugging Face               |
| Font      | Inter from Google Fonts                                     |

## You need

- **Node.js** 18+
- **pnpm** (or npm, doesn't matter)
- A **Hugging Face API token** — [get one here](https://huggingface.co/settings/tokens)

## Run it

```bash
# clone it
git clone https://github.com/paul-mothapo/redactor.git
cd redactor

# install deps
pnpm install

# set up your token
cp .env.example .env
# then edit .env and paste your HF token:
# HF_TOKEN=hf_token_here

# run
pnpm dev
```

Opens at **http://localhost:3001**. That's it. You're live.

## How to use it

1. **Upload** an image (click or drag-and-drop)
2. Hit **Detect Faces** — the AI scans the image
3. **Review** — dashed boxes appear on detected regions. Confirm or reject each one
4. **Draw** your own boxes if you want to add more
5. Pick a redaction style — **black**, **blur**, or **white**
6. Click **Apply Redaction**
7. **Download** the result as PNG
8. **Undo** if you messed up. **Clear** to start over

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add `HF_TOKEN` as an env variable
4. Deploy

Vercel handles the rest. Static files + serverless API. Zero config beyond the token.
