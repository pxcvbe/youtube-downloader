# ============================================
# FILE: app/utils.py
# ============================================
import yt_dlp
import os
import tempfile
from pathlib import Path

def get_ydl_opts(extra_opts=None):
    """Get yt-dlp options with anti-bot measures"""
    base_opts = {
        'quiet': True,
        'no_warnings': True,
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web'],
                'skip': ['hls', 'dash']
            }
        },
        # Anti-bot headers
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-us,en;q=0.5',
            'Accept-Encoding': 'gzip,deflate',
            'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
            'Connection': 'keep-alive',
        },
        # Bypass age gate
        'age_limit': None,
        # Use cookies if available
        'cookiesfrombrowser': None,
        # Additional options
        'nocheckcertificate': True,
        'ignoreerrors': False,
        'no_color': True,
    }
    
    if extra_opts:
        base_opts.update(extra_opts)
    
    return base_opts

def get_video_info(url):
    """Get video information without downloading"""
    ydl_opts = get_ydl_opts({'extract_flat': False})
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return {
                'id': info.get('id'),
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'uploader': info.get('uploader'),
                'view_count': info.get('view_count'),
                'description': info.get('description', '')[:200] + '...' if info.get('description') else '',
            }
    except Exception as e:
        # Clean error message
        error_msg = str(e)
        if 'Sign in to confirm' in error_msg or 'bot' in error_msg.lower():
            raise Exception('YouTube bot detection triggered. Try using cookies or wait a few minutes.')
        raise Exception(f'Failed to get video info: {error_msg}')

def get_download_formats(url):
    """Get available download formats"""
    ydl_opts = get_ydl_opts()
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = []
            
            # Filter dan format video quality
            seen_resolutions = set()
            for f in info.get('formats', []):
                resolution = f.get('resolution', 'unknown')
                # Skip duplicates and audio-only formats
                if (f.get('vcodec') != 'none' and 
                    f.get('acodec') != 'none' and 
                    resolution not in seen_resolutions and
                    resolution != 'unknown'):
                    
                    seen_resolutions.add(resolution)
                    formats.append({
                        'format_id': f.get('format_id'),
                        'ext': f.get('ext'),
                        'resolution': resolution,
                        'filesize': f.get('filesize'),
                        'quality': f.get('format_note', 'unknown')
                    })
            
            # Sort by resolution (higher first)
            formats.sort(key=lambda x: int(x['resolution'].split('x')[1]) if 'x' in x['resolution'] else 0, reverse=True)
            
            return formats[:10]  # Return top 10 formats
    except Exception as e:
        error_msg = str(e)
        if 'Sign in to confirm' in error_msg or 'bot' in error_msg.lower():
            raise Exception('YouTube bot detection triggered. Try using cookies or wait a few minutes.')
        raise Exception(f'Failed to get formats: {error_msg}')

def download_video(url, format_id='best', extract_audio=False):
    """Download video and return file path"""
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    
    # Configure yt-dlp options
    extra_opts = {
        'format': format_id,
        'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
        # Merge best video and audio
        'merge_output_format': 'mp4',
    }
    
    # If extracting audio, add postprocessor
    if extract_audio:
        extra_opts['format'] = 'bestaudio/best'
        extra_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }]
        extra_opts['merge_output_format'] = None
    
    ydl_opts = get_ydl_opts(extra_opts)
    
    try:
        # Download
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
            # Get the downloaded filename
            if extract_audio:
                filename = ydl.prepare_filename(info).rsplit('.', 1)[0] + '.mp3'
            else:
                filename = ydl.prepare_filename(info)
            
            file_path = os.path.join(temp_dir, os.path.basename(filename))
            
            return file_path, os.path.basename(filename)
    except Exception as e:
        error_msg = str(e)
        if 'Sign in to confirm' in error_msg or 'bot' in error_msg.lower():
            raise Exception('YouTube bot detection triggered. Try using cookies or wait a few minutes.')
        raise Exception(f'Download failed: {error_msg}')