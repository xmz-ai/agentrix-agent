# MCP Patterns Reference

## Pattern 1: REST API Integration

For connecting to REST APIs:

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';

const BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';

export default createSdkMcpServer({
  name: 'example-rest-api',
  version: '1.0.0',
  tools: [
    tool('api_get', 'GET request', {
      endpoint: z.string(),
    }, async (args) => {
      const response = await fetch(`${BASE_URL}${args.endpoint}`, {
        headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
      });
      return { content: [{ type: 'text', text: await response.text() }] };
    }),

    tool('api_post', 'POST request', {
      endpoint: z.string(),
      body: z.any(),
    }, async (args) => {
      const response = await fetch(`${BASE_URL}${args.endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(args.body)
      });
      return { content: [{ type: 'text', text: await response.text() }] };
    }),
  ],
});
```

---

## Pattern 2: Database Operations

For database queries:

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';

export default createSdkMcpServer({
  name: 'example-database',
  version: '1.0.0',
  tools: [
    tool('query', 'Execute SQL query', {
      sql: z.string(),
      params: z.array(z.any()).optional(),
    }, async (args) => {
      const db = await connectDatabase(process.env.DATABASE_URL!);
      const results = await db.query(args.sql, args.params || []);
      return { content: [{ type: 'text', text: JSON.stringify(results) }] };
    }),
  ],
});
```

---

## Pattern 3: File Conversion

For file format conversions:

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import puppeteer from 'puppeteer';
import * as fs from 'fs';

export default createSdkMcpServer({
  name: 'example-converter',
  version: '1.0.0',
  tools: [
    tool('html_to_pdf', 'Convert HTML to PDF', {
      htmlPath: z.string(),
      outputPath: z.string(),
    }, async (args) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const html = fs.readFileSync(args.htmlPath, 'utf-8');
      await page.setContent(html);
      await page.pdf({ path: args.outputPath, format: 'A4' });
      await browser.close();
      return { content: [{ type: 'text', text: `Created: ${args.outputPath}` }] };
    }),
  ],
});
```

---

## Pattern 4: With AgentrixContext

For Agentrix platform integration:

```typescript
import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';
import { z } from 'zod';
import { join } from 'path';
import * as fs from 'fs';

export default function(context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'agentrix-workspace',
    version: '1.0.0',
    tools: [
      tool('save_file', 'Save to workspace', {
        filename: z.string(),
        content: z.string(),
      }, async (args) => {
        const workspace = context.getWorkspace();
        const filePath = join(workspace, args.filename);
        fs.writeFileSync(filePath, args.content);
        return { content: [{ type: 'text', text: `Saved: ${filePath}` }] };
      }),

      tool('get_info', 'Get task info', {}, async () => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              taskId: context.getTaskId(),
              userId: context.getUserId(),
              workspace: context.getWorkspace(),
            })
          }]
        };
      }),
    ],
  });
}
```

---

## Registering Custom SDK MCP Tools

**IMPORTANT**: After building custom MCP tools, register in `.claude/config.json`:

```json
{
  "systemPrompt": {
    "path": "system_prompt.md",
    "mode": "replace"
  },
  "settings": {
    "permissionMode": "bypassPermissions",
    "allowedTools": [
      "mcp__servername__*"
    ]
  },
  "sdkMcpTools": [
    "plugins/{plugin-name}/dist/index.js"
  ]
}
```
The `allowedTools` array contains the tools which is used by agents.
The `sdkMcpTools` array contains paths to compiled MCP server entry points (relative to `.claude/` directory).

---

## Existing MCP Server Configuration

For using pre-built MCP servers, configure in `.mcp.json`:

**Note:** No `env` field needed - environment variables are already injected into process at startup.

### GitHub

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```
Required env var: `GITHUB_TOKEN` (registered in `save_agent_in_db`)

### PostgreSQL

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"]
    }
  }
}
```
Required env var: `DATABASE_URL` (registered in `save_agent_in_db`)

### Slack

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"]
    }
  }
}
```
Required env var: `SLACK_BOT_TOKEN` (registered in `save_agent_in_db`)

---

## Tool Return Format

All tools must return:

```typescript
return {
  content: [
    { type: 'text', text: 'result string' }
  ]
};
```

For errors:

```typescript
return {
  content: [
    { type: 'text', text: `Error: ${error.message}` }
  ],
  isError: true
};
```
