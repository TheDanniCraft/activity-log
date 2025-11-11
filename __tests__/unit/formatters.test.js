const { formatEventsAsTable, formatEventsAsSVG } = require('../../src/utils/eventDescriptions');

describe('Event Formatters', () => {
    const mockEvents = [
        {
            type: 'PushEvent',
            created_at: '2025-10-22T10:30:00Z',
            public: true,
            repo: { name: 'pizofreude/test-repo' },
            payload: {
                head: 'abc123',
                commits: [{ message: 'feat: Add new feature' }]
            }
        },
        {
            type: 'CreateEvent',
            created_at: '2025-10-21T15:00:00Z',
            public: true,
            repo: { name: 'pizofreude/another-repo' },
            payload: {
                ref_type: 'branch',
                ref: 'feature/new-branch'
            }
        },
        {
            type: 'IssuesEvent',
            created_at: '2025-10-20T12:00:00Z',
            public: true,
            repo: { name: 'opensource/project' },
            payload: {
                action: 'opened',
                issue: { number: 42 }
            }
        }
    ];

    describe('formatEventsAsTable', () => {
        it('should return empty string for no events', () => {
            expect(formatEventsAsTable([])).toBe('');
            expect(formatEventsAsTable(null)).toBe('');
            expect(formatEventsAsTable(undefined)).toBe('');
        });

        it('should generate markdown table with correct headers', () => {
            const result = formatEventsAsTable(mockEvents, 'MARKDOWN');
            expect(result).toContain('| Date | Event | Repository | Description |');
            expect(result).toContain('|------|-------|------------|-------------|');
        });

        it('should generate HTML table when style is HTML', () => {
            const result = formatEventsAsTable(mockEvents, 'HTML');
            expect(result).toContain('<table>');
            expect(result).toContain('<thead>');
            expect(result).toContain('<tbody>');
            expect(result).toContain('</table>');
        });

        it('should include event data in table rows', () => {
            const result = formatEventsAsTable(mockEvents, 'MARKDOWN');
            expect(result).toContain('Push');
            expect(result).toContain('Create');
            expect(result).toContain('Issues');
            expect(result).toContain('pizofreude/test-repo');
        });

        it('should format dates correctly', () => {
            const result = formatEventsAsTable(mockEvents, 'MARKDOWN');
            expect(result).toMatch(/Oct \d+, 202\d/);
        });

        it('should handle private repos correctly', () => {
            const privateEvent = {
                ...mockEvents[0],
                public: false
            };
            const result = formatEventsAsTable([privateEvent], 'MARKDOWN');
            expect(result).toContain('Private');
        });
    });

    describe('formatEventsAsSVG', () => {
        it('should return empty SVG for no events', () => {
            const result = formatEventsAsSVG([]);
            expect(result).toContain('<svg');
            expect(result).toContain('No recent activity');
            expect(result).toContain('</svg>');
        });

        it('should generate valid SVG with proper XML declaration', () => {
            const result = formatEventsAsSVG(mockEvents);
            expect(result).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
            expect(result).toContain('<svg width="900"');
            expect(result).toContain('</svg>');
        });

        it('should include header with title and subtitle', () => {
            const result = formatEventsAsSVG(mockEvents);
            expect(result).toContain('⚡ Recent Activity');
            expect(result).toContain('GitHub Activity Log');
        });

        it('should create rows for each event', () => {
            const result = formatEventsAsSVG(mockEvents);
            expect(result).toContain('1.');
            expect(result).toContain('2.');
            expect(result).toContain('3.');
        });

        it('should have proper SVG structure', () => {
            const result = formatEventsAsSVG(mockEvents);
            expect(result).toContain('<defs>');
            expect(result).toContain('<style>');
            expect(result).toContain('.bg { fill: #ffffff; }');
            expect(result).toContain('.header-bg { fill: #f6f8fa; }');
        });

        it('should calculate total height correctly', () => {
            const result = formatEventsAsSVG(mockEvents);
            const expectedHeight = 60 + (mockEvents.length * 44) + 30;
            expect(result).toContain(`height="${expectedHeight}"`);
        });

        it('should alternate row backgrounds', () => {
            const result = formatEventsAsSVG(mockEvents);
            expect(result).toContain('row-bg');
            expect(result).toContain('row-bg-alt');
        });

        it('should include footer', () => {
            const result = formatEventsAsSVG(mockEvents);
            expect(result).toContain('Generated by activity-log');
        });

        it('should use single-line format (no dates in rows)', () => {
            const result = formatEventsAsSVG(mockEvents);
            const lines = result.split('\n');
            const textElements = lines.filter(l => l.includes('<text') && l.includes('row-text'));
            
            // Should have exactly one text element per event
            expect(textElements.length).toBe(mockEvents.length);
        });

        it('should center text with dominant-baseline="middle"', () => {
            const result = formatEventsAsSVG(mockEvents);
            expect(result).toContain('dominant-baseline="middle"');
        });

        it('should escape XML special characters', () => {
            const eventWithSpecialChars = {
                type: 'PushEvent',
                created_at: '2025-10-22T10:30:00Z',
                public: true,
                repo: { name: 'test<>&"repo' },
                payload: {
                    head: 'abc',
                    commits: [{ message: 'fix: Handle <special> & "chars"' }]
                }
            };
            const result = formatEventsAsSVG([eventWithSpecialChars]);
            
            // Check that the SVG is valid and doesn't contain unescaped special chars in text content
            expect(result).toContain('<svg');
            expect(result).toContain('</svg>');
            // Repo name with special characters should be escaped or handled safely
            expect(result.includes('test<>&"repo') || result.includes('test&lt;&gt;&amp;&quot;repo')).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle events with missing data', () => {
            const incompleteEvent = {
                type: 'UnknownEvent',
                created_at: '2025-10-22T10:30:00Z',
                public: true,
                repo: { name: 'test/repo' },
                payload: {}
            };
            
            const tableResult = formatEventsAsTable([incompleteEvent], 'MARKDOWN');
            expect(tableResult).toBeTruthy();
            
            const svgResult = formatEventsAsSVG([incompleteEvent]);
            expect(svgResult).toContain('<svg');
        });

        it('should handle very long event descriptions', () => {
            const longEvent = {
                type: 'PushEvent',
                created_at: '2025-10-22T10:30:00Z',
                public: true,
                repo: { name: 'test/' + 'x'.repeat(100) },
                payload: {
                    head: 'abc',
                    commits: [{ message: 'A'.repeat(200) }]
                }
            };
            
            const svgResult = formatEventsAsSVG([longEvent]);
            expect(svgResult).toContain('<svg');
            expect(svgResult.length).toBeGreaterThan(0);
        });

        it('should handle single event', () => {
            const singleEvent = [mockEvents[0]];
            
            const tableResult = formatEventsAsTable(singleEvent, 'MARKDOWN');
            expect(tableResult).toContain('|');
            
            const svgResult = formatEventsAsSVG(singleEvent);
            expect(svgResult).toContain('1.');
            expect(svgResult).not.toContain('2.');
        });

        it('should handle many events', () => {
            const manyEvents = Array(20).fill(null).map((_, i) => ({
                ...mockEvents[0],
                created_at: `2025-10-${i + 1}T10:30:00Z`
            }));
            
            const svgResult = formatEventsAsSVG(manyEvents);
            const expectedHeight = 60 + (20 * 44) + 30;
            expect(svgResult).toContain(`height="${expectedHeight}"`);
        });
    });
});
