#!/bin/bash

# MERN CRUD App - EC2 Deployment Script
# Usage: ./deploy-ec2.sh YOUR_EC2_PUBLIC_IP

if [ -z "$1" ]; then
    echo "Error: Please provide your EC2 public IP address"
    echo "Usage: ./deploy-ec2.sh YOUR_EC2_PUBLIC_IP"
    echo "Example: ./deploy-ec2.sh 52.23.202.6"
    exit 1
fi

EC2_IP=$1

echo "🚀 Deploying MERN CRUD App on EC2..."
echo "📍 EC2 IP: $EC2_IP"
echo ""

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Set environment variable
echo "🔧 Setting API URL environment variable..."
export REACT_APP_API_URL=http://$EC2_IP:5000

# Disable BuildKit for Amazon Linux compatibility
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker system prune -f

# Rebuild and start containers
echo "🏗️  Building and starting containers..."
docker-compose up -d --build

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Container status:"
docker ps

echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://$EC2_IP:3000"
echo "   Backend:  http://$EC2_IP:5000/users"
echo ""
echo "📋 View logs with: docker-compose logs -f"
