FROM node:10-alpine AS installer
WORKDIR /app

COPY package*.json .
RUN apk add --no-cache git openssh-client
RUN npm install

FROM node:10-alpine AS builder

ARG COMMIT_TXT
ARG BUILD_DATE
ARG BUILD_ENV

WORKDIR /app

COPY --from=installer /app /app
COPY . .

RUN echo "[]" > src/assets/gitlog.json
RUN echo "\"${BUILD_ENV}/${COMMIT_TXT} - ${BUILD_DATE}\"" > src/assets/hash.json

RUN export NODE_ENV=production
RUN npm run build
#RUN tar czvf app.tar.gz -C dist .

FROM nginx:1.25.4

WORKDIR /app

ENV USER=pdaccess
ENV GROUPNAME=$USER
ENV UID=10001
ENV GID=10001

RUN addgroup \
    --gid "$GID" \
    "$GROUPNAME" \
&&  adduser \
    --disabled-password \
    --gecos "" \
    --home "$(pwd)" \
    --ingroup "$GROUPNAME" \
    --no-create-home \
    --uid "$UID" \
    $USER

COPY --from=builder /app/dist /app
COPY cs.app.conf /etc/nginx/nginx.conf

RUN chown -R $USER:$GROUPNAME /var/cache/nginx /var/log/nginx

USER $USER:$GROUPNAME

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
