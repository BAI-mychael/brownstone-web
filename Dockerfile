FROM node:20-alpine

WORKDIR /opt/app

# Make lockfile optional to ensure the build starts
COPY package.json package-lock.js[n] ./

RUN npm install

COPY . .

# Build the production assets
RUN npm run build

EXPOSE 5173

# Use --host to ensure Traefik can reach the Vite server
CMD ["npm", "run", "dev", "--", "--host"]