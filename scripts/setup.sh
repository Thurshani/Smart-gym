#!/bin/bash

echo "🚀 Setting up FitFlow Gym Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "📥 Please install MongoDB from: https://docs.mongodb.com/manual/installation/"
    echo "🔄 Or use MongoDB Atlas cloud database"
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cp env.example.txt .env
    echo "✅ Environment file created at backend/.env"
    echo "⚙️  Please update the environment variables as needed"
else
    echo "✅ Environment file already exists"
fi

cd ..

echo "✅ Setup completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Start MongoDB (if using local instance)"
echo "2. Update backend/.env with your MongoDB URI if needed"
echo "3. Run 'npm run setup:seed' to populate the database with sample data"
echo "4. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "📖 Check README.md for detailed instructions" 