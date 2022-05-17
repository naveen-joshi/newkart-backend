From node:16.13.0-alpine as builder
COPY . /app
WORKDIR /app
RUN npm install

From node:16.13.0-alpine
COPY --from=builder . .
EXPOSE 5000
CMD ["node", "backend/server.js"]