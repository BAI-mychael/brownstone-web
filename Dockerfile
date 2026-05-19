FROM node:20-alpine

WORKDIR /opt/app

# Make lockfile optional to ensure the build starts
COPY package.json package-lock.js[n] ./

RUN npm install

COPY . .

# Dev container does not need production build during image creation
# RUN npm run build

EXPOSE 5173

# Next.js development server
CMD ["npm", "run", "dev"]