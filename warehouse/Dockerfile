FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

RUN npm i -g serve

COPY . .

RUN npm run build

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

EXPOSE 3001

CMD ["serve", "-s", "dist", "-l", "3001"]
