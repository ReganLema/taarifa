#!/bin/bash
set -e

echo "========================================="
echo "  Taarifa Backend - Starting..."
echo "========================================="

echo "⏳ Waiting for PostgreSQL..."
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
    sleep 1
done
echo "✅ PostgreSQL is ready!"

echo "📦 Running migrations..."
python manage.py migrate --noinput

echo "🚀 Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000
