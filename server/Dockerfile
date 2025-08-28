FROM node:22-alpine

WORKDIR /app

COPY package*.json tsconfig*.json ./
RUN npm ci

COPY . .

EXPOSE 3100

CMD ["npm", "run", "start"]
