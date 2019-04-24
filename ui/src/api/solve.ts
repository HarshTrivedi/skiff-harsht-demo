import axios, { AxiosPromise } from 'axios';

import { API_BASE_URL } from './api';
import { Query } from './Query';
import { Answer } from './Answer';

/**
 * This method fetches an answer by hitting /api/1/solve, which is defined in
 * api.py. The provided query is serialized and sent across the wire as JSON.
 *
 * Axios is a library for making HTTP requests that works across older browsers.
 * You can find more about it here:
 * @see https://github.com/axios/axios
 *
 * @param {string}  question
 * @param {string}  firstAnswer
 * @param {string}  secondAnswer
 *
 * @returns {Promise<Answer>}
 */
export function solve(query: Query): Promise<Answer> {
    return (
        axios.post(`${API_BASE_URL}/api/1/solve`, query)
             .then(resp => resp.data)
    );
}
