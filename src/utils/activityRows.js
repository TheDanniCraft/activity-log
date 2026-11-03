import { warning } from '@actions/core';
import createEventDescriptions from './eventDescriptions.js';
import { applyTemplate, extractEventData } from './templateEngine.js';

export function buildActivityRows(events, { eventEmojiMap, eventTemplate, hideDetailsOnPrivateRepos = false }) {
    const descriptions = createEventDescriptions(eventEmojiMap);
    return events.map(event => {
        const { type, repo, payload } = event;
        const isPrivate = !event.public;
        const pr = payload.pull_request || {};
        const action = pr.merged ? 'merged' : payload.action;
        const data = extractEventData(event, eventEmojiMap, hideDetailsOnPrivateRepos);
        let description = applyTemplate(eventTemplate, data);
        if (!description) {
            const formatter = typeof descriptions[type] === 'function' ? descriptions[type] : descriptions[type]?.[action];
            if (formatter) {
                description = formatter({ repo, isPrivate, pr, payload, hideDetailsOnPrivateRepos });
            } else {
                warning(`Unknown event type or action: ${type}/${action || ''}`);
                description = `Unknown event in ${data.repo}`;
            }
        }
        if (event.count > 1 && !eventTemplate?.includes('{count}')) description += ` (${event.count}×)`;
        return { description, date: data.date, type: data.event_type, repo: data.repo, repoUrl: data.repo_url };
    });
}
