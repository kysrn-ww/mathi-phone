#!/bin/bash
# Forzar el uso de uvicorn directamente
echo "Starting Mathi Phone API with uvicorn..."
export PYTHONUNBUFFERED=1
exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app --bind 0.0.0.0:$PORT
