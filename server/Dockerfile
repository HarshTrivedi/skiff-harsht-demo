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

# Install Python dependencies
COPY --chown=skiff-build:skiff-build requirements.txt .
RUN pip install -r requirements.txt

# Python dependencies work better when installed as root, so we don't swith
# to the build user until after they're in place
USER skiff-build

# Copy over the source code
COPY --chown=skiff-build:skiff-build server server/

# This enables the Flask debugger and activates code that restarts the
# API as you make changes
ENV FLASK_ENV development

# This allows imports in our API to be fully qualified, i.e. `from server.api`
# rather than `from api`.
ENV PYTHONPATH "/usr/local/src/skiff/app/server:${PYTHONPATH}"

# Kick things off
ENTRYPOINT [ "python" ]
CMD [ "server/start.py" ]
