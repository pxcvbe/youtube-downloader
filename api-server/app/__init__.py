# ====================
# FILE: app/__init__.py
# ====================
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Enable CORS untuk semua routes
    CORS(app, resources={r"/v1/api/*": {"origins": "*"}})

    # Register blueprints
    from app.routes import api

    app.register_blueprint(api, url_prefix="/v1/api")

    return app
