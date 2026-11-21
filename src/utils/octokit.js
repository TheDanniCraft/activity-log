import { getOctokit } from '@actions/github';
import { throttling } from '@octokit/plugin-throttling';

const MAX_RATE_LIMIT_RETRIES = 4;

function formatThrottleContext(limitType, retryAfter, options, retryCount) {
    return `[throttle][${limitType}] method=${options.method} url=${options.url} retry_after_s=${retryAfter} retry_count=${retryCount}`;
}

function createOctokit(token) {
    return getOctokit(
        token,
        {
            throttle: {
                onRateLimit: (retryAfter, options, octokit, retryCount) => {
                    octokit.log.warn(formatThrottleContext('primary', retryAfter, options, retryCount));
                    if (retryCount >= MAX_RATE_LIMIT_RETRIES) return false;
                    octokit.log.info(
                        `[throttle][primary] retrying request in ${retryAfter}s`
                    );
                    return true;
                },
                onSecondaryRateLimit: (retryAfter, options, octokit, retryCount) => {
                    octokit.log.warn(formatThrottleContext('secondary', retryAfter, options, retryCount));
                    if (retryCount >= MAX_RATE_LIMIT_RETRIES) return false;
                    octokit.log.info(
                        `[throttle][secondary] retrying request in ${retryAfter}s`
                    );
                    return true;
                },
                fallbackSecondaryRateRetryAfter: 60
            }
        },
        throttling
    );
}

export {
    createOctokit
};
