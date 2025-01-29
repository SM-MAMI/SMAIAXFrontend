FROM nginxinc/nginx-unprivileged:1.26-alpine AS base
WORKDIR /app
EXPOSE 8080

FROM node:20.17.0-alpine AS build
WORKDIR /build
COPY package*.json .
RUN npm ci --ignore-scripts
COPY src src
COPY public public
COPY index.html .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
COPY nginx nginx
RUN npm run build

FROM base AS final
COPY --from=build /build/dist /usr/share/nginx/html
COPY --from=build /build/nginx/nginx.conf /etc/nginx/conf.d/default.conf
USER nginx
CMD ["nginx", "-g", "daemon off;"]