FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for building psycopg2 and other packages
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Command is handled by docker-compose
