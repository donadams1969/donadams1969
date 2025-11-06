#!/bin/bash
set -ex

BRANCH_NAME="ci/govcloud-deploy"

# Delete the branch if it exists, then create it fresh to ensure a clean state
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    git branch -D "$BRANCH_NAME"
fi
git checkout -b "$BRANCH_NAME"

# Create the directory and the workflow file
mkdir -p .github/workflows
cat <<'EOF' > .github/workflows/deploy_govcloud.yml
# .github/workflows/deploy_govcloud.yml
#
# CI/CD Workflow for VALORA VO (Veteran Onboarding Portal)
# Deploys to AWS GovCloud (us-gov-west-1) ECS
#
name: Deploy VALORA VO to AWS GovCloud (ECS)

# Trigger this workflow on a push to the main branch
on:
  push:
    branches:
      - 'main'

# Set environment variables, hard-coding the GovCloud region
env:
  AWS_REGION: us-gov-west-1
  ECR_REPOSITORY: valorai-vet-onboarding-portal
  ECS_SERVICE: valorai-vo-service
  ECS_CLUSTER: valorai-govcloud-cluster
  ECS_TASK_DEFINITION: valorai-vo-task-definition.json
  CONTAINER_BACKEND: valorai-backend
  CONTAINER_FRONTEND: valorai-frontend

# Set permissions for OIDC (OpenID Connect) for secure auth
permissions:
  id-token: write   # Required for federating with AWS
  contents: read    # Required to check out the code

jobs:
  deploy-to-govcloud:
    name: Build, Push, and Deploy
    runs-on: ubuntu-latest

    steps:
      - name: 1. Checkout Code
        uses: actions/checkout@v4

      - name: 2. Configure AWS GovCloud Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws-us-gov:iam::${{ secrets.AWS_GOVCLOUD_ACCOUNT_ID }}:role/GitHubAction-ECR-DeployRole
          aws-region: ${{ env.AWS_REGION }}

      - name: 3. Log in to Amazon ECR (GovCloud)
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
        with:
          registry-type: gov-cloud # Specify GovCloud registry

      - name: 4. Build, Tag, and Push Backend Image
        id: build-backend
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:${{ env.CONTAINER_BACKEND }}-$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:${{ env.CONTAINER_BACKEND }}-$IMAGE_TAG
          echo "backend_image_uri=$ECR_REGISTRY/$ECR_REPOSITORY:${{ env.CONTAINER_BACKEND }}-$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: 5. Build, Tag, and Push Frontend Image
        id: build-frontend
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:${{ env.CONTAINER_FRONTEND }}-$IMAGE_TAG ./frontend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:${{ env.CONTAINER_FRONTEND }}-$IMAGE_TAG
          echo "frontend_image_uri=$ECR_REGISTRY/$ECR_REPOSITORY:${{ env.CONTAINER_FRONTEND }}-$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: 6. Download ECS Task Definition
        run: |
          aws ecs describe-task-definition --task-definition ${{ env.ECS_TASK_DEFINITION }} --region ${{ env.AWS_REGION }} \
          --query taskDefinition > task-definition.json

      - name: 7. Fill in New Image URIs in Task Definition
        id: render-task-definition
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: task-definition.json
          container-name-1: ${{ env.CONTAINER_BACKEND }}
          image-1: ${{ steps.build-backend.outputs.backend_image_uri }}
          container-name-2: ${{ env.CONTAINER_FRONTEND }}
          image-2: ${{ steps.build-frontend.outputs.frontend_image_uri }}

      - name: 8. Deploy New Task Definition to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ${{ steps.render-task-definition.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
EOF

# Add and commit the file
git add .github/workflows/deploy_govcloud.yml
git commit -m "ci: add OIDC-based GovCloud ECS deploy workflow"
git log -1
