---
name: Command Creator
description: This skill should be used when embla determines that the agent needs slash commands or user-invokable shortcuts. Covers command content format and best practices.
version: 0.3.0
---

# Command Creator

## Overview

Commands are user-invokable shortcuts that trigger specific workflows. Users invoke them with `/command-name` syntax.

**What Commands Are:**
- User shortcuts for common operations
- Workflow triggers for predefined processes
- Interactive prompts for multi-step operations

**What Commands Are NOT:**
- Automated actions (use Hooks)
- Executable code (commands are markdown)
- API integrations (use MCP Tools)

## When to Use Commands

| Scenario | Use Command? | Example |
|----------|--------------|---------|
| Quick action user triggers often | Yes | `/commit`, `/review` |
| Multi-step wizard | Yes | `/create-component` |
| Frequently used workflow | Yes | `/generate-report` |
| Automated background task | No (Hook) | Session cleanup |
| External API call | No (MCP Tool) | Database query |
| Domain knowledge | No (Skill) | Security patterns |

---

## Creating Commands

### Directory Structure

Commands are created as markdown files in the agent's plugin directory:

```
{agent}/claude/plugins/{plugin-name}/commands/
└── {command-name}.md     # Command file (one per command)
```

### Command File Format

**File:** `{command-name}.md`

```markdown
# {Command Name}

{Brief description shown in /help}

## What This Command Does
...

## Steps
...
```

The filename (without `.md`) becomes the slash command name (e.g., `generate-report.md` → `/generate-report`).

---

## commandContent Format

The `commandContent` is markdown instructions for Claude:

```markdown
## What This Command Does
Brief explanation.

## Steps
1. Step one
2. Step two
3. Step three

## Output
What the user should expect.
```

**Important:** Commands are instructions FOR Claude, not messages TO the user.

```markdown
# Good (instructions for Claude)
Review this code for security vulnerabilities.
Provide line numbers and severity ratings.

# Bad (message to user)
This command will review your code.
You'll receive a report.
```

---

## Best Practices

### 1. Clear Action Names

```
Good: /commit, /review, /generate-report
Bad: /do-stuff, /action, /run
```

### 2. Single Responsibility

Each command should do ONE thing well:

```
Good:
- /commit - Creates a commit
- /push - Pushes to remote

Bad:
- /commit-push-deploy - Does too much
```

### 3. Error Handling

Include error handling instructions:

```markdown
## Error Handling

If no staged changes:
- Inform user: "No staged changes found"
- Suggest: `git add <files>` to stage changes
```

### 4. Integration Points

Commands can reference:
- Skills for domain knowledge
- MCP Tools for external operations
- Other commands for workflows

---

## Additional Resources

### Reference Files
- **`references/command-patterns.md`** - Command pattern templates

### Example Files
- **`examples/security-scan.md`** - Complete security scan command (commandContent)
