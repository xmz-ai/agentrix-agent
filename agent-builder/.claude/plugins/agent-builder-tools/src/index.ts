// Agent Builder MCP Server
// Provides tools for creating and managing custom agents

import { createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import type { AgentrixContext } from '@agentrix/shared';

// Import tool factories
import { createWriteAgentStructure } from './tools/agentStructure.js';
import { createCreatePlugin } from './tools/pluginTools.js';
import { createValidateAgent } from './tools/validation.js';
import { createCreateAgentInDb } from './tools/databaseTools.js';

/**
 * Agent Builder MCP Server Factory
 *
 * IMPORTANT: This function receives AgentrixContext from CLI at runtime.
 * The context provides access to workspace paths, user/task IDs, and RPC operations.
 *
 * Available tools (4 total):
 * - Agent Structure: write_agent_structure
 * - Plugins: create_plugin
 * - Database: create_agent_in_db (includes env vars schema)
 * - Validation: validate_agent
 */
export default function(context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'agent-builder-tools',
    version: '2.0.0',
    tools: [
      // Agent structure (1 tool)
      createWriteAgentStructure(context),

      // Plugin tools (1 tool)
      createCreatePlugin(context),

      // Database (1 tool)
      createCreateAgentInDb(context),

      // Validation (1 tool)
      createValidateAgent(context),
    ],
  });
}
