# Claude Task Manager Instructions

## Quick Reference Commands

When you want me to work with the task list, use these exact phrases:

### View Tasks
- `"Show task list"` - I'll read and summarize current priorities
- `"What's critical?"` - I'll show only critical tasks
- `"What should we work on next?"` - I'll recommend highest priority task

### Add Tasks  
- `"Add critical task: [description]"` - Adds to critical section
- `"Add high priority: [description]"` - Adds to high priority section
- `"Add task: [description]"` - Adds to medium priority (default)

### Update Tasks
- `"Mark completed: [task name]"` - Moves task to completed section
- `"Make [task] critical"` - Moves task to critical priority
- `"Remove task: [task name]"` - Removes task entirely

### File Locations
- **Main Task List**: `/TASKS.md` (you can edit directly)
- **Instructions**: `/.claude/task-manager.md` (this file)

## Implementation Details

The task list uses:
- **Markdown checkboxes**: `[ ]` for pending, `[x]` for completed
- **Priority emojis**: 🚨 Critical, 🔴 High, 🟡 Medium, 🟢 Low
- **Sections**: Tasks automatically organized by priority level

## Example Usage

**You say:** "Add critical task: Fix login redirect issue"
**I do:** Read TASKS.md, add to critical section, save file

**You say:** "Mark completed: Test System.io webhook"  
**I do:** Move task from current section to completed section

**You say:** "What's next?"
**I do:** Read TASKS.md, recommend highest priority incomplete task