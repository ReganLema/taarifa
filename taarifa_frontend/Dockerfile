# ============================================
# Stage 1: Build React app
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (use npm install instead of ci to avoid lock file issues)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_GRAPHQL_URL=http://localhost:8001/graphql/
ARG VITE_API_URL=http://localhost:8001/api/

# Set environment variables
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL \
    VITE_API_URL=$VITE_API_URL

# Build the application
RUN npx vite build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]