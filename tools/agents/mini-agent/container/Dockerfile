FROM node:20-slim

RUN npm i -g @openai/codex

WORKDIR /workspace

COPY tools/agents/mini-agent/container/entrypoint.sh /usr/local/bin/mini-agent

ENTRYPOINT ["/usr/local/bin/mini-agent"]
