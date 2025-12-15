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
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 241533138370.dkr.ecr.us-east-1.amazonaws.com
```

2. Tag the image:
```bash
docker tag ecs-fastify:latest 241533138370.dkr.ecr.us-east-1.amazonaws.com/ecs-fastify:latest
```

3. Push the image:
```bash
docker push 241533138370.dkr.ecr.us-east-1.amazonaws.com/ecs-fastify:latest
```

### ECS Configuration

The container is configured to:
- Listen on port 3000 (mapped via ECS service/load balancer)
- Run as a non-root user for security
- Use production-optimized Node.js Alpine image

## CI/CD Pipeline (AWS CodePipeline)

This project includes a `buildspec.yml` for AWS CodeBuild that automatically builds and pushes Docker images to ECR.

### Pipeline Setup

1. **Create a CodePipeline** in the AWS Console
2. **Source Stage**: Connect to your repository (GitHub, CodeCommit, etc.)
3. **Build Stage**: Create a CodeBuild project with the following settings:
   - **Environment image**: Managed image
   - **Operating system**: Amazon Linux 2
   - **Runtime**: Standard
   - **Image**: `aws/codebuild/amazonlinux2-x86_64-standard:5.0`
   - **Privileged**: ✅ Enabled (required for Docker builds)
   - **Service role**: Needs ECR push permissions (see below)

4. **Deploy Stage** (optional): Add ECS deploy action using the `imagedefinitions.json` artifact

### Required IAM Permissions

The CodeBuild service role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "arn:aws:ecr:us-east-1:241533138370:repository/ecs-fastify"
    }
  ]
}
```

### Build Output

The build produces:
- Docker image tagged with the git commit hash (e.g., `abc1234`)
- Docker image tagged as `latest`
- `imagedefinitions.json` artifact for ECS deployment

