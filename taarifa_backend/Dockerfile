# ============================================
# Stage 1: Base Python image
# ============================================
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Stage 2: Install Python dependencies
# ============================================
FROM base AS dependencies

# Copy requirements
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ============================================
# Stage 3: Production image
# ============================================
FROM base AS production

# Copy Python dependencies from previous stage
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Create non-root user
RUN useradd -m -s /bin/bash taarifa && \
    mkdir -p /app/staticfiles /app/media && \
    chown -R taarifa:taarifa /app

# Copy project files
COPY --chown=taarifa:taarifa . .

# Switch to non-root user
USER taarifa

# Expose port
EXPOSE 8000

# Run entrypoint script
COPY --chown=taarifa:taarifa entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]