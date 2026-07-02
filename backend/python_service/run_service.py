#!/usr/bin/env python3
"""
Startup script for Marg-Manthan Python Service.
This script preprocesses data and starts the FastAPI service.
"""

import os
import sys
import subprocess

def install_dependencies():
    """Install Python dependencies."""
    print("Installing Python dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def run_service():
    """Run the FastAPI service."""
    print("Starting FastAPI service...")
    subprocess.run([sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

if __name__ == "__main__":
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Check if dependencies are installed
    try:
        import fastapi
        import pandas
        import networkx
        print("Dependencies already installed.")
    except ImportError:
        install_dependencies()
    
    # Run the service
    run_service()
