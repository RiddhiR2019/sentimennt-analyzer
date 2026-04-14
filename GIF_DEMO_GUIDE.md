# GIF Demo Guide for GitHub

This guide will help you create an animated GIF demo of the Sentiment Analyzer for your GitHub README.

## Tools Needed

Choose one of these free tools:

### Option 1: **ScreenToGif** (Recommended - Windows)
- Download: https://www.screentogif.com/
- Easy to use, lightweight, outputs GIF directly
- **Best for**: This project

### Option 2: **OBS Studio** (Cross-platform)
- Download: https://obsproject.com/
- Record MP4, convert to GIF with FFmpeg
- **Best for**: Higher quality, professional videos

### Option 3: **GIFCAP** (Web-based)
- Use: https://gifcap.dev/
- Browser-based, no installation
- **Best for**: Quick, simple GIFs

---

## Step 1: Prepare Your App

Make sure both servers are running:

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8001

# Terminal 2: Frontend
npm run dev
# App will be at http://localhost:5174
```

---

## Step 2: Demo Script (30-45 seconds)

Follow this exact sequence for the best demo:

### **Scene 1: Home Page (5 seconds)**
- Open http://localhost:5174
- Show the hero section with method descriptions
- Pan slowly to show all content
- Point out the "Analyze" and "Dashboard" buttons

### **Scene 2: Enter Analyzer (2 seconds)**
- Click "Analyze" button
- Wait for page to load
- Show input field and samples

### **Scene 3: Positive Example (8 seconds)**
- Type or click: **"I love this product! It works flawlessly and feels premium."**
- Click "Analyze Sentiment"
- Wait for results to load
- Show the comparison table:
  - NLTK score (≈0.82)
  - VADER score (≈0.84)
  - Hybrid score (≈0.83)
- Highlight the green "Positive" badges

### **Scene 4: Social Media Example (8 seconds)**
- Clear the text
- Type or click: **"OMG I LOVE THIS!!! Best purchase ever!!! 😍🎉"**
- Click "Analyze Sentiment"
- Show results
- Point out that VADER score is HIGHER (0.94) because it recognizes:
  - CAPS (LOVE, BEST)
  - Multiple punctuation (!!!)
  - Emojis (😍🎉)

### **Scene 5: Negation Example (8 seconds)**
- Clear the text
- Type: **"This is not good and I didn't enjoy it"**
- Click "Analyze Sentiment"
- Show that it's classified as "Negative" despite containing "good"
- Explain: Negation detection handles "not good" → negative

### **Scene 6: Dashboard (8 seconds)**
- Click "Dashboard" link
- Show pie chart with sentiment distribution
- Show bar chart with confidence trend
- Show metric cards (Total, Positive, Neutral, Negative)
- Explain analytics accumulate as you analyze more

### **Scene 7: End (2 seconds)**
- Click back to "Analyze"
- Maybe add one more quick example
- Fade out

---

## For ScreenToGif (Recommended)

### 1. Open ScreenToGif

### 2. Click "Recorder" tab
- Set recording quality to **Medium** (good balance)
- Framerate: **15 FPS** (smooth but not huge file)
- Resolution: Keep default (1920x1200 or adjust to fit your screen)

### 3. Position the window
- Move ScreenToGif to the side
- Position browser window to show full app (800x600 minimum)

### 4. Click "Record"
- Follow the demo script above (30-45 seconds total)
- Speak slowly if recording with audio
- Pause between scenes (1 second) for clarity

### 5. Edit (Optional)
- Click "Edit" when done
- Remove first/last awkward frames
- Adjust speed if too fast (View > Speed)

### 6. Export
- Click "File" → "Export as"
- Choose **GIF** format
- Name it: `demo.gif`
- Save to: `d:\One Last Time\Applications\AI Apps\Sentiment Analyzer\`
- Quality: High
- Repeat count: 0 (infinite loop)

---

## For OBS Studio

### 1. Setup
- New Scene > Game Capture or Window Capture
- Select your browser window
- Start recording (F12)

### 2. Record Demo
- Follow script above
- Stop recording (F12)
- File saved to Videos folder

### 3. Convert to GIF
```bash
# Install FFmpeg first
# Windows: choco install ffmpeg

ffmpeg -i input.mp4 -vf "fps=15,scale=800:-1" demo.gif
```

---

## Step 3: Add to GitHub README

### Option A: Top of README (Eye-catching)

Edit `README.md`:

```markdown
# Sentiment Analyzer

Compare three NLP sentiment analysis methods in real-time!

![Sentiment Analyzer Demo](./demo.gif)

**Features:**
- 3 sentiment analysis methods (NLTK, VADER, Hybrid)
...
```

### Option B: In Features Section

```markdown
## Features

### Three Analysis Methods
Instantly compare NLTK, VADER, and Hybrid approaches:

![Sentiment Analyzer Demo](./demo.gif)

- **NLTK**: Fast, rule-based
...
```

### Option C: In Getting Started

```markdown
## Quick Demo

See it in action:

![Sentiment Analyzer Demo](./demo.gif)

Want to try it yourself? Follow the setup instructions below.
```

---

## Step 4: Upload to GitHub

### 4a. Add GIF to Repository

```bash
# Copy GIF to repo root
Copy-Item "path\to\demo.gif" "d:\One Last Time\Applications\AI Apps\Sentiment Analyzer\"

# Stage, commit, push
git add demo.gif
git commit -m "Add GIF demo for GitHub"
git push origin main
```

### 4b. Update README

```bash
# Edit README.md with the GIF markdown
git add README.md
git commit -m "Add demo GIF to README"
git push origin main
```

---

## Pro Tips for Great GIFs

✅ **DO:**
- Keep it under 45 seconds
- Show 2-3 distinct features
- Use clear, readable text
- Leave pauses between sections
- Show the best features first
- Use 15 FPS for smooth playback

❌ **DON'T:**
- Make it too long (viewers lose interest)
- Include unnecessary clicks or waits
- Use fast scrolling (hard to follow)
- Cover important features with windows
- Use extremely high resolution (big file size)

---

## GIF File Size Optimization

If your GIF is too large (>5MB):

### Option 1: Reduce Resolution
```bash
ffmpeg -i demo.gif -vf scale=800:-1 demo-small.gif
```

### Option 2: Reduce Framerate
```bash
ffmpeg -i demo.gif -vf "fps=10" demo-optimized.gif
```

### Option 3: Use Online Compressor
- https://ezgif.com/
- Upload GIF, adjust settings, download

---

## Example README with GIF

```markdown
# 🎯 Sentiment Analyzer

Compare three NLP sentiment analysis methods side-by-side!

![Sentiment Analyzer Demo](./demo.gif)

## Features

✅ **Three Methods:** NLTK (rule-based), VADER (social media), Hybrid (combined)
✅ **Live Comparison:** See how different algorithms score the same text
✅ **Negation Handling:** Correctly identifies "not good" as negative
✅ **Analytics Dashboard:** Track sentiment trends over time

## Quick Start

```bash
# Backend
cd backend && python -m uvicorn app:app --port 8001

# Frontend (new terminal)
npm run dev
```

Visit http://localhost:5174

## How It Works

1. **Enter text** anywhere - formal, social media, or mixed
2. **See all three methods** analyze simultaneously
3. **Compare scores** and understand differences
4. **Track analytics** on the dashboard

---
```

---

## Troubleshooting

### GIF plays too fast
- Use ScreenToGif's Edit → Speed to slow down (0.8x or 0.7x)
- Or reduce FPS when exporting

### GIF is too blurry
- ScreenToGif: Record at Higher quality
- OBS: Use bitrate 5000-8000 kbps

### GIF is huge file
- Reduce resolution: scale 800 or 1024
- Reduce FPS: use 10-12 instead of 15
- Use online compressor

### GitHub won't show GIF
- Make sure path is relative: `./demo.gif` not `C:\path\demo.gif`
- File is in repo root directory
- Filename has no spaces
- Push changes: `git push`

---

## Alternative: GitHub Demo Link

If you can't create a GIF, add this instead:

```markdown
## Live Demo

[Click here to see a live demo](http://localhost:5174)

Or watch a [2-minute walkthrough video](https://your-video-link)
```

---

## Summary

1. ✅ Download ScreenToGif
2. ✅ Run both servers (backend + frontend)
3. ✅ Record 30-45 second demo following the script
4. ✅ Export as `demo.gif`
5. ✅ Add to README with `![Demo](./demo.gif)`
6. ✅ Push to GitHub

**Result:** Professional-looking demo on your GitHub repo! 🚀

---

Need help recording? Let me know!
