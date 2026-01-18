echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la
echo "Files in backend directory (if exists):"
ls -la backend 2>/dev/null || echo "backend directory not found"

export PYTHONPATH=$PYTHONPATH:.
echo "PYTHONPATH: $PYTHONPATH"

echo "Starting Mathi Phone API with uvicorn..."
exec python -m uvicorn server:app --host 0.0.0.0 --port $PORT
