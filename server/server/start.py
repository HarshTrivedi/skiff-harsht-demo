import argparse
import os
import sys
import logging
from typing import Tuple
from gevent.pywsgi import WSGIServer
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from server.api import create_api
from server.utils import with_no_cache_headers, StackdriverJsonFormatter

def start():
    """
    Starts up a HTTP server attached to the provider port, and optionally
    in development mode (which is ideal for local development but unideal
    for production use).
    """
    parser = argparse.ArgumentParser(description='Starts your application\'s HTTP server.')
    parser.add_argument(
        '--port',
        '-p',
        help='The port to listen on',
        default=8000
    )
    parser.add_argument(
        '--prod',
        help=
            'If specified the server is started in production mode, where ' +
            'the server isn\'t restarted as changes to the source code occur.',
        action='store_true'
    )
    args = parser.parse_args()

    # We set the log level explicitly, as to avoid other libraries manipulating
    # it for us.
    root_logger = logging.getLogger()
    root_logger.setLevel(os.environ.get('LOG_LEVEL', default=logging.INFO))

    # In production, write all logs to stdout but format them using JSON
    # so that they're queriable by fields like their severity, etc.
    if args.prod:
        handler = logging.StreamHandler()
        handler.setFormatter(StackdriverJsonFormatter())
        root_logger.addHandler(handler)

    # The location of the precompiled verison of the UI. This is only used
    # in production.
    ui_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ui'))
    app = Flask(__name__, static_folder=ui_dir, static_url_path='/p')

    # Cache static assets by default for a year. JS, CSS and images can be
    # aggressively cached as we use cache-breakers when they update.
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 60 * 60 * 24 * 365

    # Disable caching for HTML documents and API responses so that clients
    # always talk to the source (this server).
    @app.after_request
    def set_cache_headers(resp: Response) -> Response:
        if resp.mimetype == "text/html" or resp.mimetype == "application/json":
            return with_no_cache_headers(resp)
        else:
            return resp

    # While developing locally we enable CORS, since the UI runs locally
    # on a different port.
    if not args.prod:
        CORS(app, resources={ r'/api/*': { 'origins': 'http://localhost:3000' } })

    # Bind the API functionality to our application. You can add additional
    # API endpoints by editing api.py.
    app.register_blueprint(create_api(), url_prefix="/api/1")

    # This route tells Kubernetes that the the server is healthy and can
    # handle end user traffic. If a non 200 is returned, the instance will
    # be cycled out of service until it's health.y As there are 2 versions of
    # your service running by default -- end users won't be impacted unless
    # both become unhealthy at the same time.
    @app.route('/health')
    def health() -> Tuple[str, int]:
        return 'OK', 200

    # This route is meant to provide programmatic information about your
    # running application for debugging and analysis purposes. It's available to
    # all clients, so don't put anything sensitive in the output, but you can
    # include opaque identifiers and other information that's non-sensitive but
    # helpful in determining the running state of your application.
    @app.route('/info')
    def info() -> str:
        return jsonify({ 'sha': os.environ.get('GIT_SHA') })

    # In production we do two things that we don't do while developing locally
    #   1. We use the gevent server, which can handle more concurrent traffic
    #      than the webserver built into Flask.
    #   2. We serve the static, pre-compiled UI files (in development they're
    #      served via a HTTP server provided by `react-ts-scripts`).
    if args.prod:
        @app.route('/', defaults={ 'request_path': '' })
        @app.route('/<path:request_path>')
        def index(request_path: str):
            return app.send_static_file('index.html')

        http_server = WSGIServer(('0.0.0.0', args.port), app, log=root_logger,
            error_log=root_logger)
        app.logger.info(f'Server listening at http://0.0.0.0:{args.port}')
        http_server.serve_forever()
    else:
        app.run(host='0.0.0.0', port=args.port)

if __name__ == '__main__':
    start()
