export function groupActivityEvents(events) {
    const groups = new Map();
    const result = [];
    const seen = new Set();
    for (const event of events) {
        if (event.id && seen.has(event.id)) continue;
        if (event.id) seen.add(event.id);
        // Pushes share a destination; other events retain their individual subjects and links.
        const key = event.type === 'PushEvent'
            ? JSON.stringify([event.type, event.repo.name, event.payload.ref, event.actor?.login, event.public])
            : null;
        const previous = key && groups.get(key);
        if (previous) {
            previous.count++;
        } else {
            const group = { ...event, count: 1 };
            result.push(group);
            if (key) groups.set(key, group);
        }
    }
    return result;
}
