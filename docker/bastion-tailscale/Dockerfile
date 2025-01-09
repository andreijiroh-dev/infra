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
    croc \
    dumb-init

COPY entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY motd /etc/motd
VOLUME [ "/var/lib/tailscale" ]

ENTRYPOINT [ "/usr/bin/dumb-init", "--", "/usr/local/bin/docker-entrypoint.sh" ]