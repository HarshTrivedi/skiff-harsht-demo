# The first build stage prepares the UI. This involves compiling the UI
# codebase into static assets that are served by the Python based HTTP
# server.
FROM node:10.15.2 AS ui-build

# We add a user for building the application. This user has write access to
# the source code directory.
RUN groupadd -r skiff-build && useradd -r -g skiff-build skiff-build

# Setup a spot for our code
WORKDIR /usr/local/src/skiff/app/ui
RUN chown -R skiff-build /usr/local/src/skiff
RUN chgrp -R skiff-build /usr/local/src/skiff

# After creating the directory for our code, switch to that user (we start
# as root).
USER skiff-build

# The yarn cache isn't relevant in this context, and yarn tries to put it in
# the user's $HOME by default, but that doesn't exist for the `skiff-build` user
# so we have to put it elsewhere.
ENV YARN_CACHE_FOLDER /usr/local/src/skiff/app/.yarncache

# Install UI dependencies.
COPY --chown=skiff-build:skiff-build ui/package.json ui/yarn.lock ./
RUN yarn install

# This tell build scripts and library code in the UI that we're in production,
# so things should be optimized (smaller) and errors should be opaque.
ENV NODE_ENV production
ENV BABEL_ENV production

# This tells the UI build to append all static paths with `/p`.  That route is
# handled by Flask and serves static files instead of being handled as a
# potential API endpoint.
ENV PUBLIC_URL /p

# Add the UI source code and execute a build, which transpiles our TypeScript
# application into a single JavaScript executable that's compatible with
# lots of different browsers.
COPY --chown=skiff-build:skiff-build ui/. .
RUN yarn build

# The second stage sets up our runtime, which is a Python, Flask based HTTP
# server that serves the static files that make up our UI and handles requests
# to the API endpoints we define.
FROM python:3.7.2

# We add a user for building the application. This user has write access to
# the source code directory.
RUN groupadd -r skiff-build && useradd -r -g skiff-build skiff-build

# Create a separate runtime user, so they can't write to the filesystem
RUN groupadd -r skiff-app && useradd -r -g skiff-app skiff-app

# Setup a spot for the server code
WORKDIR /usr/local/src/skiff/app/server
RUN chown -R skiff-build /usr/local/src/skiff
RUN chgrp -R skiff-build /usr/local/src/skiff

# This copies the compiled output of the first build stage into the publid
# directory. The public directory contains static assets that our HTTP server
# is responsible for serving.
COPY --chown=skiff-build:skiff-build --from=ui-build /usr/local/src/skiff/app/ui/build ui

# Install Python dependencies
COPY --chown=skiff-build:skiff-build server/requirements.txt .
RUN pip install -r requirements.txt

# Python dependencies work better when installed as root, so we don't swith
# to the build user until after they're in place
USER skiff-build

# Copy over the source code
COPY --chown=skiff-build:skiff-build server/server server/

USER skiff-app

ENV FLASK_ENV production
ENV PYTHONPATH "/usr/local/src/skiff/app/server:${PYTHONPATH}"

# Kick things off
ENTRYPOINT [ "python" ]
CMD [ "server/start.py" ]
