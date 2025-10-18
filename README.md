# MERN CRUD Docker Application

A full-stack MERN (MongoDB, Express, React, Node.js) application with Docker containerization and CI/CD deployment to AWS EC2.

## Features

- ✅ CRUD operations for user management
- ✅ MongoDB database
- ✅ Express.js REST API
- ✅ React frontend
- ✅ Docker & Docker Compose setup
- ✅ GitHub Actions CI/CD pipeline
- ✅ AWS EC2 deployment ready

## Project Structure

```
mern-crud-docker/
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   └── App.js
│   └── package.json
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

## Local Development

### Prerequisites

- Docker Desktop installed
- Git

### Running Locally

```bash
# Clone the repository
git clone https://github.com/shehanmadusanka2002/mern-crud-docker.git
cd mern-crud-docker

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: mongodb://localhost:27017
```

### Stop the application

```bash
docker-compose down
```

## AWS EC2 Deployment

### EC2 Instance Setup (Amazon Linux 2023)

1. **Launch EC2 Instance**
   - AMI: Amazon Linux 2023
   - Instance Type: t2.medium or larger (recommended)
   - Security Group: Open ports 22 (SSH), 80 (HTTP), 3000 (Frontend), 5000 (Backend)

2. **Connect to EC2**

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

3. **Install Docker & Docker Compose**

```bash
# Update system packages
sudo dnf update -y

# Install Git (required for cloning repository)
sudo dnf install git -y

# Install Docker
sudo dnf install docker -y

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
git --version

# Log out and log back in for group changes to take effect
exit
```

4. **Log back in and deploy**

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Clone the repository
git clone https://github.com/shehanmadusanka2002/mern-crud-docker.git
cd mern-crud-docker

# Set the API URL environment variable (IMPORTANT!)
# Replace YOUR_EC2_PUBLIC_IP with your actual EC2 public IP
export REACT_APP_API_URL=http://YOUR_EC2_PUBLIC_IP:5000

# Disable BuildKit (required for Amazon Linux compatibility)
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0

# Start the application
docker-compose up -d --build

# Check running containers
docker ps

# View logs
docker-compose logs -f
```

**Important**: Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP address (e.g., `http://52.23.202.6:5000`)

### For Ubuntu EC2 Instances

If you're using Ubuntu instead of Amazon Linux:

```bash
# Update packages
sudo apt update

# Install Docker
sudo apt install docker.io -y

# Install Docker Compose
sudo apt install docker-compose -y

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Set API URL before deploying
export REACT_APP_API_URL=http://YOUR_EC2_PUBLIC_IP:5000

# Log out and log back in
exit
```

## GitHub Actions CI/CD Setup

### Required GitHub Secrets

Add these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

1. **EC2_HOST**: Your EC2 public IP or hostname
   - Example: `3.123.45.67` or `ec2-3-123-45-67.compute.amazonaws.com`

2. **EC2_SSH_KEY**: Your EC2 private key (`.pem` file content)
   - Copy the entire content of your `.pem` file

### Deployment Process

Every push to the `main` branch will automatically:
1. Connect to your EC2 instance
2. Pull the latest code
3. Rebuild and restart Docker containers

## API Endpoints

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

## Environment Variables

### Backend
- `MONGODB_URI`: MongoDB connection string (default: `mongodb://mongo:27017/merncrud`)
- `PORT`: Backend server port (default: `5000`)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:5000`)

## Troubleshooting

### Port already in use
```bash
# Stop all containers
docker-compose down

# Remove all stopped containers
docker system prune -a
```

### MongoDB connection issues
```bash
# Check if MongoDB container is running
docker ps

# View MongoDB logs
docker-compose logs mongo
```

### Frontend not accessible
```bash
# Check if containers are running
docker ps

# View frontend logs
docker-compose logs frontend
```

## Technologies Used

- **Frontend**: React 18
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud**: AWS EC2

## License

MIT License

## Author

Shehan Madusanka
- GitHub: [@shehanmadusanka2002](https://github.com/shehanmadusanka2002)
