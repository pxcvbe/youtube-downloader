# Simple YouTube Downloader

Aplikasi web untuk download video YouTube dengan interface modern dan backend API yang powerful menggunakan [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).

<img width="1920" height="1398" alt="image" src="https://github.com/user-attachments/assets/66ba7986-82c6-4daa-8be3-9d4793eab76e" />

![Python](https://img.shields.io/badge/Python-3.14-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![yt--dlp](https://img.shields.io/badge/yt--dlp-2025.11.12-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- ✅ Download video YouTube dalam berbagai kualitas (MP4)
- ✅ Download audio only (MP3) dengan konversi otomatis
- ✅ Real-time video information (thumbnail, title, duration, views)
- ✅ Multiple quality options (Best, 720p, 480p, 360p, custom)
- ✅ Modern & responsive UI dengan Tailwind CSS
- ✅ REST API backend dengan Flask + yt-dlp
- ✅ Anti-bot detection measures
- ✅ Health check & status monitoring
- ✅ CORS enabled untuk cross-origin requests
- ✅ Production-ready deployment to Railway

## 📁 Project Structure

```
youtube-downloader/
│
├── backend/                          # Backend API
│   ├── app/
│   │   ├── __init__.py              # Flask app initialization
│   │   ├── routes.py                # API endpoints
│   │   └── utils.py                 # yt-dlp helper functions
│   │
│   ├── venv/                        # Virtual environment
│   ├── .gitignore                   # Git ignore rules
│   ├── requirements.txt             # Python dependencies
│   ├── runtime.txt                  # Python version for Railway
│   ├── Procfile                     # Railway/Heroku deployment config
│   ├── railway.json                 # Railway configuration
│   └── run.py                       # Application entry point
│
└── frontend/                        # Frontend web app
    ├── css/
    │   └── style.css                # Custom styles
    ├── js/
    │   └── main.js                  # JavaScript logic
    └── index.html                   # Main HTML file
```

## 🛠️ Tech Stack

### Backend
- **Python 3.14** - Programming language
- **Flask 3.0** - Web framework
- **yt-dlp 2025.11.12** - YouTube download library (updated!)
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - Production WSGI server
- **FFmpeg** - Audio/Video processing (required for MP3 conversion)

### Frontend
- **HTML5** - Markup
- **Tailwind CSS** - Styling framework (CDN)
- **Vanilla JavaScript** - Client-side logic (separated files)

## 🚀 Getting Started

### Prerequisites

- Python 3.14+
- pip (Python package manager)
- **FFmpeg** (REQUIRED for audio conversion)
- Git
- Modern web browser

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/youtube-downloader.git
cd youtube-downloader
```

#### 2. Install FFmpeg (CRITICAL!)

**FFmpeg is REQUIRED for MP3 audio conversion!**

##### Windows (3 Options):

**Option A: Chocolatey (Recommended)**
```bash
# Open PowerShell as Administrator
choco install ffmpeg
```

**Option B: Scoop**
```bash
scoop install ffmpeg
```

**Option C: Manual**
1. Download from https://www.gyan.dev/ffmpeg/builds/
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to PATH

##### Windows with WSL (Ubuntu):
```bash
# Open WSL terminal
wsl

# Install FFmpeg in Ubuntu
sudo apt update
sudo apt install ffmpeg

# Verify
ffmpeg -version
```

##### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install ffmpeg
```

##### macOS:
```bash
brew install ffmpeg
```

##### Verify Installation:
```bash
# Check FFmpeg
ffmpeg -version

# Check FFprobe
ffprobe -version
```

#### 3. Setup Backend

##### Option A: Native Windows/Linux/Mac

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (CMD):
venv\Scripts\activate
# Windows (PowerShell):
venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# IMPORTANT: Upgrade yt-dlp to latest version
pip install --upgrade yt-dlp
```

##### Option B: WSL Ubuntu (RECOMMENDED for Windows users)

```bash
# Open WSL
wsl

# Navigate to project (access Windows files)
cd /mnt/c/Users/YourName/path/to/youtube-downloader/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Upgrade yt-dlp
pip install --upgrade yt-dlp

# Verify installations
yt-dlp --version  # Should show 2025.11.12 or newer
ffmpeg -version   # Should show FFmpeg version
```

#### 4. Run Backend (Development)

```bash
# Make sure venv is activated
python run.py

# Server will run at http://localhost:5000
```

#### 5. Setup Frontend

```bash
# Navigate to frontend folder
cd frontend

# Open index.html in browser
# Or use VS Code Live Server extension
```

**IMPORTANT**: Make sure JavaScript file is loaded at the END of `<body>`:

```html
<body>
    <!-- All HTML content -->
    
    <!-- Load JS at the END -->
    <script src="js/main.js"></script>
</body>
```

## 📡 API Documentation

Base URL: `http://localhost:5000/api` (development)

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

#### 2. Get Video Information
```http
POST /api/video-info
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "id": "VIDEO_ID",
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 180,
  "uploader": "Channel Name",
  "view_count": 1000000,
  "description": "Video description..."
}
```

#### 3. Get Available Formats
```http
POST /api/formats
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "formats": [
    {
      "format_id": "22",
      "ext": "mp4",
      "resolution": "1280x720",
      "filesize": 50000000,
      "quality": "720p"
    }
  ]
}
```

#### 4. Download Video
```http
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format_id": "best"
}
```

**Response:** Binary file (video/mp4)

#### 5. Download Audio (MP3)
```http
POST /api/download-audio
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:** Binary file (audio/mpeg)

**Note**: Requires FFmpeg installed on server!

## 🌐 Deployment

### Deploy Backend to Railway

#### Step 1: Prepare Repository

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - YouTube Downloader"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/youtube-downloader.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Railway will auto-detect Python and deploy
7. **IMPORTANT**: Railway automatically includes FFmpeg in build!
8. Wait for deployment to complete (~3-5 minutes)
9. Click **"Settings"** → **"Domains"** → **"Generate Domain"**
10. Copy your URL: `https://your-app.up.railway.app`

#### Step 3: Verify Railway Deployment

Check logs for:
```
✓ FFmpeg detected
✓ yt-dlp installed
✓ Server running on port 5000
```

#### Step 4: Update Frontend API URL

Edit `frontend/js/main.js`, line ~5:

```javascript
// Change from:
const API_BASE_URL = 'http://localhost:5000/api';

// To:
const API_BASE_URL = 'https://your-app.up.railway.app/api';
```

### Deploy Frontend

#### Option 1: Netlify
1. Drag & drop `frontend` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Done! Get instant URL

#### Option 2: Vercel
```bash
npm i -g vercel
cd frontend
vercel
```

#### Option 3: GitHub Pages
1. Push `frontend/` folder to GitHub
2. Go to Settings → Pages
3. Select branch and `/frontend` folder
4. Save and get URL

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Get video info
curl -X POST http://localhost:5000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Test yt-dlp directly
yt-dlp --version
yt-dlp -f bestaudio "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Test Frontend

1. Open `index.html` in browser
2. Press **F12** (Developer Tools)
3. Check Console - should be NO red errors
4. Check API Status indicator (should be green "Connected")
5. Test with YouTube URL:
   - Paste: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Click "Ambil Info"
   - Video info should appear
   - Try "Download Best Quality (MP4)"
   - Try "Download Audio (MP3)"

## 🐛 Troubleshooting

### 1. ERROR: ffmpeg not found

**Symptoms:**
```
Postprocessing: ffprobe and ffmpeg not found
```

**Solution:**
```bash
# Verify FFmpeg installation
ffmpeg -version
ffprobe -version

# If not found, install:
# Windows: choco install ffmpeg
# Linux: sudo apt install ffmpeg
# Mac: brew install ffmpeg

# Restart terminal and Flask server
```

### 2. ERROR: 403 Forbidden / Bot Detection

**Symptoms:**
```
HTTP Error 403: Forbidden
Sign in to confirm you're not a bot
```

**Solutions:**

**A. Update yt-dlp (Most Important!)**
```bash
pip install --upgrade yt-dlp
yt-dlp --version  # Should be 2025.11.12+
```

**B. Use Cookies (Most Effective)**
1. Install browser extension: "Get cookies.txt LOCALLY"
2. Login to YouTube in browser
3. Export cookies to `backend/cookies.txt`
4. Update `app/utils.py`:
```python
base_opts = {
    'cookiefile': 'cookies.txt',
}
```

**C. Wait & Retry**
- Wait 5-10 minutes between downloads
- Try less popular videos first
- Don't spam requests

### 3. JavaScript Not Working

**Symptoms:**
- Buttons don't work
- Console shows function errors

**Solution:**
Make sure `<script src="js/main.js"></script>` is at the **END** of `<body>`:

```html
<body>
    <!-- All content -->
    <script src="js/main.js"></script>  ← MUST BE HERE
</body>
```

### 4. API Not Connecting

**Symptoms:**
- Red "Disconnected" status
- CORS errors in console

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check CORS in backend
# app/__init__.py should have:
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Restart Flask server
python run.py
```

### 5. WSL Issues

**Problem**: Flask running in Windows but FFmpeg in WSL

**Solution**: Run EVERYTHING in WSL:
```bash
wsl
cd /mnt/c/path/to/backend
source venv/bin/activate
python run.py
```

## 📊 Performance

- Average video info fetch: **2-3 seconds**
- MP4 download speed: **Depends on video size & internet**
- MP3 conversion time: **~5-10 seconds** (FFmpeg processing)
- API response time: **< 500ms** (without download)
- Concurrent requests: **Supports multiple users**

## 🔒 Security & Legal

- ⚠️ **Educational/Personal use only**
- ⚠️ Respect YouTube Terms of Service
- ⚠️ Don't abuse API or download copyrighted content
- ⚠️ Use rate limiting in production
- ⚠️ Always use HTTPS in production
- ⚠️ Don't share your cookies.txt file

## 🔄 Updates & Maintenance

### Keep yt-dlp Updated (IMPORTANT!)

YouTube frequently changes their systems. Update yt-dlp regularly:

```bash
# Weekly update recommended
pip install --upgrade yt-dlp

# Check version
yt-dlp --version

# Test after update
yt-dlp "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Update All Dependencies

```bash
pip install --upgrade -r requirements.txt
```

## 💡 Tips & Best Practices

### For Avoiding Bot Detection:
1. ✅ Keep yt-dlp updated (weekly)
2. ✅ Use cookies for authenticated access
3. ✅ Add delays between downloads (5-10 seconds)
4. ✅ Don't download extremely popular videos in bulk
5. ✅ Use different user agents if needed

### For Better Performance:
1. ✅ Use WSL on Windows for better compatibility
2. ✅ Enable SSD for faster FFmpeg processing
3. ✅ Use production-grade server (Railway/AWS)
4. ✅ Implement caching for video info
5. ✅ Add download queue system

### For Production:
1. ✅ Add rate limiting (Flask-Limiter)
2. ✅ Implement authentication
3. ✅ Use Redis for caching
4. ✅ Add logging (errors, downloads)
5. ✅ Monitor disk space (temp files)
6. ✅ Set up automatic cleanup of old files

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Test thoroughly (especially with different videos)
4. Commit changes: `git commit -m 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Powerful YouTube downloader
- [Flask](https://flask.palletsprojects.com/) - Lightweight web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [FFmpeg](https://ffmpeg.org/) - Multimedia framework
- [Railway](https://railway.app/) - Easy deployment platform

---

## Author
- [pxcvbe](https://github.com/pxcvbe) / **Ivan Kurniawan**.


⭐ **Plz Star this repo if you find it helpful!**
