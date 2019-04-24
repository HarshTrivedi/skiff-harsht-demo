
/**
 * In develompent the UI is served on port 3000, while the API is served
 * on port 8000, while in production everything is served from 8000.
 *
 * If we're in development, direct API requests to port 8000 on the current
 * host.
 */
export const API_BASE_URL = (
    document.location.host === 'localhost:3000'
        ? 'http://localhost:8000'
        : ''
);
