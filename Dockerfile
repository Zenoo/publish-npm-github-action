# Base image
FROM node:16-buster-slim

# Copy repository
COPY ./dist /publish-npm-github

RUN chmod +x /publish-npm-github/index.js

ENTRYPOINT node /publish-npm-github/index.js