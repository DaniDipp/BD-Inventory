FROM node:18-alpine as build
WORKDIR /app
COPY tsconfig.json ./
COPY rollup.config.js ./
COPY package*.json ./
COPY src ./src
RUN npm ci
RUN npm run build

FROM node:18-alpine
WORKDIR /app
EXPOSE 8080
COPY package*.json ./
RUN npm ci --only-production
COPY --from=build /app/dist ./dist
CMD ["npm", "start"]