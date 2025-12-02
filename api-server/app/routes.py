# ====================
# FILE: app/routes.py
# ====================
from flask import Blueprint, request, jsonify, send_file
from app.utils import get_video_info, download_video, get_download_formats

api = Blueprint('api', __name__)

# ROUTE: GET /health
@api.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'API is running'
    })

# ROUTE: POST /video-info
@api.route('/video-info', methods=['POST'])
def video_info():
    """Get video information"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
            
        info = get_video_info(url)
        return jsonify(info), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ROUTE: POST /formats
@api.route('/formats', methods=['POST'])
def get_formats():
    """Get available download formats"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
            
        formats = get_download_formats(url)
        return jsonify({'formats': formats}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ROUTE: POST /download
@api.route('/download', methods=['POST'])
def download():
    """Download video"""
    try:
        data = request.get_json()
        url = data.get('url')
        format_id = data.get('format_id', 'best')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
            
        # Download video
        file_path, filename = download_video(url, format_id)
        
        # Send file and delete after
        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='video/mp4'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
# ROUTE: POST /download
@api.route('/download-audio', methods=['POST'])
def download_audio():
    """Download audio only (MP3)"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
            
        # Download audio
        file_path, filename = download_video(url, format_id='bestaudio', extract_audio=True)
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='audio/mpeg'
        )
    except Exception as e:
        return jsonify({'error': str(e)}),500