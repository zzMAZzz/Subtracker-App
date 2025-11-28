#!/bin/bash

echo "🚀 Iniciando SubTracker..."
echo ""

# Función para manejar la terminación
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo "📦 Iniciando Backend en http://localhost:3000..."
cd Backend
npm run dev &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar Frontend
echo "🎨 Iniciando Frontend en http://localhost:5173..."
cd ../Frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ SubTracker está corriendo:"
echo "   - Backend:  http://localhost:3000"
echo "   - Frontend: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"
echo ""

# Esperar indefinidamente
wait
