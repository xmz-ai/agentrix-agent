---
name: System Prompt Creator
description: This skill should be used when embla needs to write or design system prompts for agents. Covers replace vs append mode selection, the required Environment section for replace mode, and the core principles of effective system prompts.
version: 0.4.0
---

# System Prompt Creator

## Overview

System prompts define the agent's identity, capabilities, and behavior. A good system prompt enables the agent to make decisions autonomously.

---

## Replace vs Append Mode (CRITICAL)

### Replace Mode (Default Choice)

**Use replace mode in most cases.** Claude Code's base prompt is designed for general-purpose code editing. When building a specialized agent, you need a completely different prompt.

**When to use Replace:**
- **Specialized domain agents** - Web design, security audit, code review, data analysis
- **Non-coding agents** - Content writing, research, analysis, customer support
- **Agents with specific workflows** - Must follow particular processes
- **Agents with different personalities** - Different tone, style, or approach

**Replace mode means:**
- Completely replaces Claude Code's system prompt
- You define the ENTIRE agent identity and capabilities
- Agent still has access to all Claude Code tools
- **MUST include Environment section** (see below)

### Append Mode (Special Case Only)

**Use append mode ONLY when enhancing Claude Code's coding capabilities with specific constraints.**

**When to use Append:**
- Agent is a **coding assistant** that should behave like Claude Code
- BUT needs additional constraints like:
  - Must use specific internal libraries
  - Must follow company coding standards
  - Must use particular frameworks/patterns
  - Has language-specific requirements

**Append mode means:**
- Your prompt is appended to Claude Code's base prompt
- Agent inherits ALL Claude Code behavior and tool patterns
- You're adding **constraints/preferences**, not redefining the agent
- **Do NOT add Environment section** (already in base prompt)
- **Pure user instructions** - write as direct commands

### Decision Guide

```
Is this a general coding assistant that should behave like Claude Code?
    │
    ├─ NO → Use REPLACE
    │       (specialized domain, different workflow, non-coding)
    │
    └─ YES → Does it just need specific constraints/libraries/standards?
              │
              ├─ YES → Use APPEND
              │        (add constraints to base Claude Code)
              │
              └─ NO → Use REPLACE
                      (fundamentally different behavior)
```

**Examples:**

| Agent Type | Mode | Reason |
|------------|------|--------|
| Web Designer | Replace | Specialized domain, different workflow |
| Security Auditor | Replace | Specialized analysis focus |
| Code Reviewer | Replace | Different output format and focus |
| Data Analyst | Replace | Non-coding primary function |
| Python Dev (with company libs) | Append | Claude Code + specific libraries |
| React Dev (with design system) | Append | Claude Code + component constraints |
| Backend Dev (with ORM rules) | Append | Claude Code + framework standards |

---

## Replace Mode: Required Structure

Every **replace mode** system prompt MUST include the Environment section:

```markdown
# You are [Agent Name]

[Brief identity statement - 1-2 sentences]

---

## Environment

<env>
Working Dir: {{WORKING_DIR}}
Platform: {{PLATFORM}}
Date: {{DATE}}
</env>

**CONSTRAINT:** All assets must be created in the working directory.

---

[YOUR INSTRUCTIONS]
```

**The Environment section is CRITICAL because:**
- Agent needs to know where it's working
- Platform-specific behavior may be required
- Date context affects recommendations
- Without it, agent may write files to wrong locations

---

## Append Mode: Structure

Append mode prompts are **pure user instructions**. Write them as direct commands:

```markdown
# Additional Requirements

When writing code, follow these constraints:

## Required Libraries
- Use `@company/ui-kit` for all UI components
- Use `@company/api-client` for API calls
- Never import from raw `react` - use our wrapped version

## Coding Standards
- All functions must have JSDoc comments
- Use TypeScript strict mode patterns
- Follow the repository's existing naming conventions

## Testing Requirements
- Write tests alongside implementation
- Use our custom test utilities from `@company/test-utils`
```

**Do NOT include:**
- ❌ Environment section (already in base prompt)
- ❌ Identity statements (you're not replacing identity)
- ❌ Tool usage instructions (inherited from Claude Code)
- ❌ General coding guidance (inherited from Claude Code)

---

## Core Principles of Effective System Prompts

### Principle 1: Identity Defines Perspective

The agent needs to know WHO it is to make decisions from the right perspective.

**Identity includes:**
- Domain expertise (what it knows deeply)
- Professional role (what perspective it brings)
- Specialization (what it focuses on)

Identity is NOT just a name. It shapes how the agent interprets requests and prioritizes responses.

### Principle 2: Teach Decision Logic, Not Procedures

**System prompt = WHAT decisions to make and WHY**
**Skills = HOW to execute those decisions**

A good system prompt gives the agent **principles to reason with**, not step-by-step scripts.

### Principle 3: Define Scope Through Boundaries

An agent needs to know:
- What it CAN do (capabilities)
- What it SHOULD NOT do (constraints)
- When to ask for help (escalation)

Boundaries prevent the agent from overstepping while giving it freedom within scope.

### Principle 4: Delegate Implementation to Skills

System prompt should NOT contain detailed "how to" instructions. Delegate to skills.

```markdown
# In system prompt (WHAT):
"For detailed tool usage, use the agent-structure-designer skill."

# In skill (HOW):
[Complete tool parameters, file formats, code examples]
```

### Principle 5: Workflow as High-Level Structure

Workflow in system prompt should be **phases**, not detailed steps:

```markdown
## Workflow
1. Discovery: Understand the real need
2. Design: Draft complete plan
3. Confirm: Get user approval
4. Generate: Execute with tools
5. Complete: Provide next steps
```

### Principle 6: Enable Autonomous Decision-Making

Give the agent:
- **Decision frameworks** (when to do what)
- **Priority rules** (what comes first)
- **Trade-off guidance** (how to choose between options)

---

## Structure Patterns

### Pattern A: Concept-Driven (Replace Mode)

```markdown
# You are [Agent Name]

[Brief identity]

---

## Environment

<env>
Working Dir: {{WORKING_DIR}}
Platform: {{PLATFORM}}
Date: {{DATE}}
</env>

**CONSTRAINT:** All assets must be created in the working directory.

---

## Core Concepts
[Decision frameworks, principles, key distinctions]

## Your Role
[How to approach the work]

## Workflow
[High-level phases]
```

Best for: Complex agents needing autonomous judgment

### Pattern B: Task-Driven (Replace Mode)

```markdown
# You are [Agent Name]

[Brief identity]

---

## Environment

<env>
Working Dir: {{WORKING_DIR}}
Platform: {{PLATFORM}}
Date: {{DATE}}
</env>

**CONSTRAINT:** All assets must be created in the working directory.

---

## Your Task
[What the agent does]

## How to Approach
[Guidance on handling requests]

## Constraints
[Boundaries]
```

Best for: Focused agents with clear purpose

### Pattern C: Constraints-Only (Append Mode)

```markdown
# Additional Requirements

## [Category 1]
- Constraint 1
- Constraint 2

## [Category 2]
- Constraint 1
- Constraint 2
```

Best for: Enhancing Claude Code with specific rules

---

## Environment Variables

**Important Rule: Agents are forbidden from directly reading process environment variables by using bash shell or any other way.**

- MCP tools and hooks can read environment variables via `process.env` in their code
- System prompts **must NOT** instruct agents to read environment variables

❌ **WRONG:**
```markdown
**Output Directory**: Save all files to `$OUTPUT_DIR` (defaults to `./output`).
```

✅ **CORRECT:**
```markdown
**Output Directory**: Save all files to the output directory.
```

The MCP tool handles the actual path internally:
```typescript
tool('save_poster', 'Save poster to output', { ... }, async (args) => {
  const outputDir = process.env.OUTPUT_DIR || './output';  // ✅ In code
  // ...
});
```

**Rule:** System prompts describe WHAT to do. MCP tools/hooks handle HOW (including env vars).
