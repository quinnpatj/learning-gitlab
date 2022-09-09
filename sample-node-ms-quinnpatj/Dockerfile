FROM regt.nmlv.nml.com/base-images/node:16-alpine as builder

USER root:root
RUN apk add --no-cache git openssh-client make g++ py-pip
USER 1000:1000

COPY --chown=appuser:appuser ./ ./
RUN npm install --production

# need to dump those api.pfrem.me.key.pem keys
RUN find \( -name *.key -o -name *.crt -o -name *.pem -o -name *.priv \) -delete;

FROM regt.nmlv.nml.com/base-images/node:16-alpine as runner

ARG GIT_COMMIT
ENV GIT_COMMIT ${GIT_COMMIT}
ENV NODE_CONFIG_STRICT_MODE 1

COPY --chown=appuser:appuser --from=builder /tmp/app /tmp/app

USER 1000:1000

CMD ["node", "index.js"]
