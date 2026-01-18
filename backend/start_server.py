#!/usr/bin/env python3
import os
import sys
import subprocess

# Asegurarse de que el puerto esté disponible
port = os.environ.get('PORT', '8001')

# Iniciar uvicorn con la configuración correcta
cmd = [
    sys.executable, '-m', 'uvicorn', 'server:app',
    '--host', '0.0.0.0',
    '--port', port,
    '--workers', '1'
]

print(f"Starting server with command: {' '.join(cmd)}")
subprocess.run(cmd)
