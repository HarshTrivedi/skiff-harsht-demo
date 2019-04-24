from flask import Response, current_app
from pythonjsonlogger import jsonlogger

def with_no_cache_headers(request: Response) -> Response:
    """
    Returns the provided request with the appropriate HTTP headers for
    disabling browser caches.
    """
    # Remove the Last-Modified and ETag headers, since they encourage browsers
    # to issue 304 requests (which can result in a cached response).
    del request.headers['Last-Modified']
    del request.headers['ETag']

    # Explicitly prevent browsers (and proxies) from caching the response.
    request.headers['Expires'] = '0'
    request.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return request

class StackdriverJsonFormatter(jsonlogger.JsonFormatter):
    """
    Custom log JSON log formatter that adds the severity member, allowing
    end users to filter logs by the level of the log message emitted.

    TODO: Parse request logs and add fields for each request element (user-agent
    processing time, etc)

    TODO:Add a timestamp that's used in place of Stackdriver's records (which
    reflect the time the log was written to Stackdriver, I think).
    """
    def add_fields(self, log_record, record, message_dict):
        super(StackdriverJsonFormatter, self).add_fields(log_record, record,
            message_dict)
        log_record['severity'] = record.levelname
