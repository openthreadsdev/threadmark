#!/bin/bash
set -e  # Exit on error

echo "🚀 Threadmark Environment Setup"
echo "================================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "✗ Node.js version must be ≥18 (found: $(node --version))"
  exit 1
else
  echo "✓ Node.js $(node --version)"
fi

# Check if .env file exists
echo ""
echo "Checking environment configuration..."
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "! .env file not found. Copy .env.example to .env and configure it."
    exit 1
  else
    echo "! Neither .env nor .env.example found"
    exit 1
  fi
fi
echo "✓ .env file exists"

# Validate required environment variables
echo ""
echo "Validating required environment variables..."
REQUIRED_VARS="SHOPIFY_API_KEY SHOPIFY_API_SECRET DATABASE_URL REDIS_URL"
MISSING_VARS=""

for VAR in $REQUIRED_VARS; do
  if ! grep -q "^$VAR=" .env 2>/dev/null || grep -q "^$VAR=$" .env 2>/dev/null || grep -q "^$VAR=\"\"$" .env 2>/dev/null; then
    MISSING_VARS="$MISSING_VARS $VAR"
  fi
done

if [ ! -z "$MISSING_VARS" ]; then
  echo "✗ Missing or empty environment variables:$MISSING_VARS"
  echo "  Please configure these in your .env file"
  exit 1
else
  echo "✓ Required environment variables configured"
fi

# Check if Docker is running
echo ""
echo "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
  echo "✗ Docker is not running. Please start Docker Desktop."
  exit 1
else
  echo "✓ Docker is running"
fi

# Start Docker Compose services
echo ""
echo "Starting Docker Compose services (Postgres, Redis)..."
if [ -f docker-compose.yml ]; then
  docker-compose up -d
  echo "✓ Docker Compose services started"
else
  echo "! docker-compose.yml not found - skipping service startup"
fi

# Wait for Postgres
echo ""
echo "Waiting for Postgres to be ready..."
RETRIES=30
until docker-compose exec -T postgres pg_isready > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "  Waiting for Postgres... ($RETRIES attempts remaining)"
  RETRIES=$((RETRIES-1))
  sleep 1
done

if [ $RETRIES -eq 0 ]; then
  echo "✗ Postgres did not become ready in time"
  exit 1
else
  echo "✓ Postgres is ready"
fi

# Wait for Redis
echo ""
echo "Waiting for Redis to be ready..."
RETRIES=30
until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "  Waiting for Redis... ($RETRIES attempts remaining)"
  RETRIES=$((RETRIES-1))
  sleep 1
done

if [ $RETRIES -eq 0 ]; then
  echo "✗ Redis did not become ready in time"
  exit 1
else
  echo "✓ Redis is ready"
fi

# Run database migrations (if npm run db:migrate exists)
echo ""
echo "Running database migrations..."
if npm run db:migrate --if-present > /dev/null 2>&1; then
  echo "✓ Database migrations completed"
else
  echo "! Database migration script not found - skipping"
fi

# Run smoke tests (if npm run smoke-test exists)
echo ""
echo "Running smoke tests..."
if npm run smoke-test --if-present > /dev/null 2>&1; then
  echo "✓ Smoke tests passed"
else
  echo "! Smoke test script not found - skipping"
fi

# Summary
echo ""
echo "================================"
echo "✓ Environment setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review PRD.json to understand the project"
echo "  2. Run 'npm install' to install dependencies"
echo "  3. Run './ralph-once.sh' to start implementing features"
echo ""
