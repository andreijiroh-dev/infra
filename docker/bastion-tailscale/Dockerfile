FROM alpine:edge

RUN apk upgrade --no-cache \
  && apk add --no-cache \
    tailscale \
    nano \
    openssh-client \
    rclone \
    docker \
    docker-rootless-extras \
    docker-cli-compose \
    bash \
    coreutils \
    gcompat \
    croc

COPY entrypoint.sh /usr/local/bin/docker-entrypoint.sh
VOLUME [ "/var/lib/tailscale" ]

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]