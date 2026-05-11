# Taarifa - Tanzania Salary Guide & Affordability Calculator

A full-stack application for comparing salaries and calculating cost of living across Tanzanian cities.

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Apollo Client
- **Backend:** Django 5, Graphene (GraphQL), PostgreSQL
- **DevOps:** Docker, Docker Compose, Nginx

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/taarifa.git
cd taarifa

# Start all services
docker-compose up -d

# Import data
Get-Content taarifa_backend\import_data.py | docker-compose exec -T backend python manage.py shell
Get-Content taarifa_backend\import_cost.py | docker-compose exec -T backend python manage.py shell