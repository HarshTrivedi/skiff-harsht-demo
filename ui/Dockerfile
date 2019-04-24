FROM node:10.15.2

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

# This tells build scripts and libraries that we're in development, so they
# can include stuff that's helpful for debugging even if it's a tad slower.
ENV NODE_ENV development
ENV BABEL_ENV development

# The yarn cache isn't relevant in this context, and yarn tries to put it in
# the user's $HOME by default, but that doesn't exist for the `skiff-build` user
# so we have to put it elsewhere.
ENV YARN_CACHE_FOLDER /usr/local/src/skiff/app/.yarncache

# Install dependencies
COPY --chown=skiff-build:skiff-build package.json yarn.lock ./
RUN yarn install

# Copy in the source code
COPY --chown=skiff-build:skiff-build . .

# Tell `react-scripts` that it's not supposed to open a browser for us, since
# it's not running on the host machine.
ENV BROWSER none

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]
