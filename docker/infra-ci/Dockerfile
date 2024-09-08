#syntax=docker/dockerfile:experimental
ARG DEPENDENCY_PROXY="mau.dev/andreijiroh-dev/dependency_proxy/containers"
FROM ${DEPENDENCY_PROXY}/denoland/deno:bin as deno
FROM ${DEPENDENCY_PROXY}/python:3.12 as base

COPY --from=deno /deno /usr/bin/deno

RUN pip3 install --no-cache pipenv pipx \
    && pipx install --global --include-deps octodns-cloudflare octodns mkdocs

ENTRYPOINT [ "/bin/bash" ]