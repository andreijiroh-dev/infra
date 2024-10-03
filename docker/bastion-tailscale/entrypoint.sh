#!/usr/bin/env bash
set -xe

TAILSCALE_TAGS=${TAILSCALE_TAGS:-"tag:docker,tag:ssh,tag:caddy"}
TAILSCALE_DATADIR=${TAILSCALE_DATADIR:-"/var/lib/tailscale"}
TAILSCALE_DATADIR_MOUNTED=${TAILSCALE_DATADIR_MOUNTED:-"false"}

# TODO: Migrate this to a init-based setup, see linuxserver images
if [[ $TAILSCALE_DATADIR != "" ]] && [[ $TAILSCALE_DATADIR_MOUNTED != "false" ]]; then
  tailscaled -tun userspace-networking -state "${TAILSCALE_DATADIR}/tailscaled.state" -statedir "${TAILSCALE_DATADIR}" -sock5-server localhost:8081 -outbound-http-proxy-listen localhost:8080 &
else
  tailscaled -tun userspace-networking -state "mem:" -sock5-server localhost:8081 -outbound-http-proxy-listen localhost:8080 &
fi

if ! tailscale status >> /dev/null && [[ $TAILSCALE_AUTHKEY != "" ]]; then
  tailscale up --accept-routes --advertise-exit-node --advertise-connector --ssh --advertise-tags="${TAILSCALE_TAGS}" --auth-key="$TAILSCALE_AUTHKEY"
fi

if [[ $1 == "" ]]; then
  echo "Bastion up, you can now connect via Tailscale: $(tailscale ip)"
  sleep infinity
else
  echo "Running: $*"
  "$@"
fi