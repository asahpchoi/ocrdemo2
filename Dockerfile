# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build argument for Supabase configuration
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Build the app with environment variables
ENV VITE_SUPABASE_URL=https://auqddpfploduylrqjkna.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cWRkcGZwbG9kdXlscnFqa25hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjc5MTM2NCwiZXhwIjoyMDQ4MzY3MzY0fQ.Z5yoyhsZkyYPtlMGxTIy9y2MhGIg_AG1U2PwDqbWp-Q

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
