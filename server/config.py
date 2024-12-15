import os

# Configuration settings
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///me_manager.db')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 'yes')
PORT = int(os.getenv('PORT', 8080))
