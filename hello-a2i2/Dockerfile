# The base image is automatically substituted by Home Assistant
# based on the architecture of the machine.
ARG BUILD_FROM
FROM $BUILD_FROM

# Configure locale.
ENV LANG C.UTF-8

# Install dependencies.
COPY package.json /
RUN apk add --no-cache nodejs-npm && \
    npm install

# Copy source/executables.
COPY index.js /
COPY run.sh /
RUN chmod a+x /run.sh

EXPOSE 8000
CMD [ "/run.sh" ]