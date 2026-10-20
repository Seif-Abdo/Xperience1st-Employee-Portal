# Stage 1: Build production static files
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_CHATBOT_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_CHATBOT_URL=$VITE_CHATBOT_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# Railway automatically substitutes ${PORT} into /etc/nginx/templates/*.template
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV PORT=80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
