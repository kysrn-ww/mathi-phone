#!/bin/bash
# Forzar el uso de uvicorn directamente
echo "Starting Mathi Phone API with uvicorn..."
export PYTHONUNBUFFERED=1
exec python -m uvicorn server:app --host 0.0.0.0 --port $PORT
