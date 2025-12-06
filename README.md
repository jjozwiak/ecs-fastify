# Fastify REST API

A simple Hello World REST API built with Fastify.

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

### Environment Variables

- `PORT` - Server port (default: 3000 for local dev, 80 in Docker/ECS)
- `HOST` - Server host (default: 0.0.0.0)

### API Endpoints

- `GET /` - Returns a hello world message
- `GET /health` - Health check endpoint

### Example Requests

```bash
# Hello World
curl http://localhost:3000/

# Health Check
curl http://localhost:3000/health
```

## Docker

### Building the Docker Image

```bash
docker build -t ecs-fastify .
```

### Running the Docker Container

```bash
docker run -p 80:80 ecs-fastify
```

Or for local development on a different port:

```bash
docker run -p 3000:80 -e PORT=80 ecs-fastify
```

### Pushing to Amazon ECR

AWS account id - 241533138370

1. Authenticate Docker to ECR:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
```

2. Tag the image:
```bash
docker tag ecs-fastify:latest <account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest
```

3. Push the image:
```bash
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest
```

### ECS Configuration

The container is configured to:
- Listen on port 80 (required for ECS service routing)
- Run as a non-root user for security
- Use production-optimized Node.js Alpine image

