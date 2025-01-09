#!/usr/bin/env bash

TAILSCALE_TAGS=${TAILSCALE_TAGS:-"tag:docker,tag:ssh,tag:caddy"}
TAILSCALE_DATADIR=${TAILSCALE_DATADIR:-"/var/lib/tailscale"}
TAILSCALE_DATADIR_MOUNTED=${TAILSCALE_DATADIR_MOUNTED:-"false"}

# TODO: Migrate this to a init-based setup, see linuxserver images
if [[ $TAILSCALE_DATADIR != "" ]] && [[ $TAILSCALE_DATADIR_MOUNTED != "false" ]]; then
  tailscaled -tun userspace-networking -state "${TAILSCALE_DATADIR}/tailscaled.state" -statedir "${TAILSCALE_DATADIR}" -socks5-server localhost:8081 -outbound-http-proxy-listen localhost:8080 &
else
  tailscaled -tun userspace-networking -state "mem:" -socks5-server localhost:8081 -outbound-http-proxy-listen localhost:8080 &
fi

if ! tailscale status >> /dev/null && [[ $TAILSCALE_AUTHKEY != "" ]]; then
  tailscale up --accept-routes --advertise-exit-node \
    --advertise-connector --ssh --advertise-tags="${TAILSCALE_TAGS}" \
    --auth-key="$TAILSCALE_AUTHKEY" \
    && TAILSCALE_UP=1
fi

if tailscale status >> /dev/null; then
  TAILSCALE_UP=1
else
  TAILSCALE_UP=0
fi

if [[ $1 == "" ]]; then
  if [[ $TAILSCALE_UP == "1" ]]; then
    echo "Bastion up, you can now connect via Tailscale:"
    echo
    echo "  ssh root@$(tailscale ip -4) | ssh root@$(tailscale ip -6)"
    echo
    echo "If you're using tailnet lock, you might need to sign the machine first."
    echo "Visit https://login.tailscale.com/admin/machines, look for this one and."
    echo "follow the instructions on signing the device."
  else
    echo "Bastion up, but you don't signed into Tailscale yet. Try again by setting"
    echo "TAILSCALE_TAGS and TAILSCALE_AUTHKEY variables in your .env.local file and"
    echo "recreate the container."
  fi
  echo
  echo "If you're SSH directly to the Docker host where this is running, you can use this"
  echo "attach to the container instead:"
  echo
  echo "   Docker Compose (within the project directory):"
  echo "       docker compose exec -it bastion bash"
  echo
  echo "   Directly via regular Docker CLI:"
  echo "       docker exec -it bastion bash"
  echo
  echo "Enjoy managing your localdev Compose cluster!"
  sleep infinity
else
  echo "Running: $*"
  "$@"
fi