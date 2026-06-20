#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo "  Taarifa Backend - Production Boot"
echo "========================================="

echo "⏳ Waiting for PostgreSQL..."
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  sleep 2
done
echo "✅ PostgreSQL is ready!"

echo "📦 Running database migrations..."
python manage.py migrate --noinput

echo "📥 Seeding core occupation and salary records..."
python manage.py import_data

echo "💰 Seeding cost of living benchmark metrics..."
python manage.py import_cost

echo "🎨 Collecting static assets..."
python manage.py collectstatic --noinput

echo "🚀 Starting WSGI Production Server via Gunicorn..."
exec gunicorn taarifa_backend.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 60