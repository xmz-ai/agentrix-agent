# Command Patterns Reference

## Pattern 1: Simple Action

For single-purpose operations:

```markdown
## Steps

1. Run `git status` to see staged changes
2. Analyze changes to determine commit type
3. Generate conventional commit message
4. Execute `git commit -m "<message>"`
5. Show commit result

## Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **refactor**: Code restructuring
```

---

## Pattern 2: Interactive Wizard

For multi-step operations requiring user input:

```markdown
## Questions to Ask

1. **Name**: What should it be called?
2. **Type**: Which variant?
3. **Options**: Which features to include?

## Files to Create

Based on answers, create:
- `path/to/{name}.ts`
- `path/to/{name}.test.ts` (if tests selected)
- `path/to/{name}.css` (if styles selected)

## Template

[Include code template with placeholders]
```

---

## Pattern 3: Report Generator

For generating output documents:

```markdown
## Process

1. **Gather Data**
   - Collect findings from session
   - Include locations and details

2. **Organize**
   - Group by category
   - Sort by severity/priority

3. **Generate Report**
   Create markdown with:
   - Summary
   - Detailed findings
   - Recommendations

4. **Output**
   - Save to `reports/{type}-{date}.md`
   - Display summary
```

---

## Pattern 4: Setup/Configuration

For initialization workflows:

```markdown
## Step 1: Check Prerequisites

Verify:
- Required environment variables
- Dependencies installed
- Configuration files exist

## Step 2: Configure

If missing:
- Create default configuration
- Document required environment variables in README.md

## Step 3: Validate

Run validation:
- Test connections
- Verify permissions
- Check for issues

## Output

Display status:
- ✅ Configured correctly
- ❌ Issues found (with fixes)
```

---

## Pattern 5: Integration Command

For orchestrating multiple components:

```markdown
## Process

1. **Use Skills**
   Apply knowledge from:
   - skill-name-1
   - skill-name-2

2. **Call MCP Tools**
   Execute with:
   - `mcp__server__tool_name`

3. **Generate Output**
   Compile results

4. **Follow-up**
   Offer related commands: /next-step
```

---

## Error Handling Template

Always include error handling:

```markdown
## Error Handling

If [condition]:
- Inform user: "[message]"
- Suggest: [action to fix]

If [another condition]:
- Show error details
- Provide recovery steps
```

---

## Naming Conventions

| Pattern | Examples |
|---------|----------|
| Action verb | `/commit`, `/deploy`, `/review` |
| Generate + noun | `/generate-report`, `/generate-docs` |
| Create + noun | `/create-component`, `/create-test` |
| Check/Verify | `/check-deps`, `/verify-config` |

Avoid:
- Generic names: `/run`, `/do`, `/action`
- Too long: `/create-and-deploy-and-notify`
- Unclear: `/process`, `/handle`
