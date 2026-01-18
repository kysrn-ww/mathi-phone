web: PYTHONPATH=$PYTHONPATH:. gunicorn -w 4 -k uvicorn.workers.UvicornWorker --chdir backend server:app
