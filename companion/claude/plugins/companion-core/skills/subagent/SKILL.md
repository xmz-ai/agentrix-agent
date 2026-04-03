---
name: Sub-Agent Management
description: Dictionary of available agents and sub-agent delegation patterns
---

# Sub-Agent Management

**⚠️ This skill needs initialization**

On your first session, use `mcp__agentrix__list_agents` to fetch available agents, then update this file with the agent dictionary.

## Workflow

1. Call `mcp__agentrix__list_agents` to get available agents
2. Format as an agent dictionary (see system prompt for guidance)
3. Update this file with the formatted dictionary
4. Reference this file when deciding which agent to delegate to

## Expected Format

After initialization, this file should contain:

### Published Agents

#### Agent Name
- **ID**: `agent-xxx`
- **Type**: claude/codex
- **Developer**: Developer Name
- **Description**: What this agent does

(Repeat for each agent)

### Draft Agents

(Same format as published agents)

---

**Note:** Keep this updated as new agents are created or removed.
