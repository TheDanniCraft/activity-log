# Feature: Custom Event Formatting

## Summary
This PR introduces a powerful new feature that allows users to customize how their GitHub activity events are displayed in their README files. Users can now define custom templates using placeholders to achieve personalized and branded activity logs.

## Changes Made
- ✅ Added `EVENT_TEMPLATE` input parameter to `action.yml`
- ✅ Enhanced configuration processing in `config.js`
- ✅ Created `templateEngine.js` with template processing functions
- ✅ Modified event formatting logic in `github.js` to support custom templates
- ✅ Added comprehensive documentation with examples in `README.md`
- ✅ Updated features list to highlight the new capability

## Key Features
- **Flexible Templates**: Users can define custom formats using placeholders
- **Rich Placeholders**: Support for `{icon}`, `{action}`, `{repo}`, `{repo_url}`, `{date}`, `{number}`, `{url}`, `{ref}`, `{ref_type}`
- **Backward Compatible**: Existing workflows continue to work without changes
- **Fallback Support**: Automatically uses default formatting if template fails
- **Private Repo Awareness**: Handles private repositories appropriately

## Example Usage
```yaml
uses: TheDanniCraft/activity-log@v1
with:
  GITHUB_USERNAME: "yourusername"
  GITHUB_TOKEN: ${{ secrets.TOKEN }}
  EVENT_TEMPLATE: "[{icon}] {action} {repo} on {date}"
```

## Template Examples
- **Simple**: `[{icon}] {action} {repo} on {date}` → `[🚀] committed username/repo on 10/2/2024`
- **Detailed**: `{icon} **{action}** [{repo}]({repo_url}) - {date}` → `🚀 **committed** [username/repo](https://github.com/username/repo) - 10/2/2024`
- **Compact**: `{icon} {action} {repo}` → `🚀 committed username/repo`

## Testing
- ✅ All JavaScript files pass syntax checks
- ✅ Template engine tested with various event types and template combinations
- ✅ Backward compatibility verified

## Related Issue
Fixes #<issue-number> - Feature Request: Custom Event Formatting

## Breaking Changes
None - this is a purely additive feature that maintains full backward compatibility.
