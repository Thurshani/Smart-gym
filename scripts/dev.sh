#!/bin/bash

echo "🚀 Starting FitFlow in Development Mode..."

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Function to kill background processes on script exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup EXIT

echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo "🎨 Starting frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "🌍 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:5001"
echo "📊 API Health: http://localhost:5001/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for processes to complete
wait 