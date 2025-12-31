// Database operations tools

import {tool} from '@anthropic-ai/claude-agent-sdk';
import {z} from 'zod';
import type {AgentrixContext} from '@agentrix/shared';
import {resolveAgentDir} from '../utils/fileSystem.js';
import type {ToolResponse} from '../utils/types.js';

/**
 * Create agent in database tool factory
 * CRITICAL: Call this AFTER all files are created to register the agent
 */
export function createSaveAgentInDb(context: AgentrixContext) {
  return tool(
  'save_agent_in_db',
  'Register agent in database AFTER all files are created. agentDir is automatically resolved from name.',
  {
    name: z.string().describe('Agent name (same name used in write_agent_structure)'),
    description: z.string().optional().describe('Agent description'),
    type: z.string().default('claude').describe('Agent type (claude, codex, etc.)'),
    envVars: z.array(z.object({
      name: z.string().describe('Variable name (e.g., API_KEY)'),
      type: z.enum(['string', 'number', 'boolean']).describe('Variable type'),
      description: z.string().describe('Variable description'),
      required: z.boolean().default(false).describe('Whether required'),
      defaultValue: z.string().optional().describe('Default value'),
    })).optional().describe('Environment variables required by agent'),
    isUpdate: z.boolean().optional().default(false).describe("Whether is agent updated"),
  },
  async (args) => {
    try {
      const workspace = context.getWorkspace();

      // Resolve agentDir from name
      const agentDir = resolveAgentDir(workspace, args.name);

      // Call context.saveDraftAgent() via RPC
      const response = await context.saveDraftAgent({
        name: args.name,
        agentDir,
        type: args.type as 'claude' | 'codex',
        description: args.description,
        envVars: args.envVars,
        isUpdate: args.isUpdate
      });

      // Build user-friendly env vars message
      let envVarsMessage = '';
      if (args.envVars && args.envVars.length > 0) {
        const required = args.envVars.filter(v => v.required);
        const optional = args.envVars.filter(v => !v.required);

        if (required.length > 0) {
          envVarsMessage += '\n\nRequired environment variables:\n';
          required.forEach(v => {
            envVarsMessage += `  - ${v.name} (${v.type}): ${v.description}\n`;
          });
        }

        if (optional.length > 0) {
          envVarsMessage += '\nOptional environment variables:\n';
          optional.forEach(v => {
            const defaultInfo = v.defaultValue ? ` (default: ${v.defaultValue})` : '';
            envVarsMessage += `  - ${v.name} (${v.type}): ${v.description}${defaultInfo}\n`;
          });
        }

        envVarsMessage += '\nEnvironment variables should be configured in the agent\'s README.md.';
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: `Agent '${args.name}' registered with name: ${response.displayName}${envVarsMessage}`,
            data: {
              agentId: response.agentId,
              agentDir: agentDir,
              envVarsRequired: args.envVars?.filter(v => v.required).map(v => v.name) || [],
              envVarsOptional: args.envVars?.filter(v => !v.required).map(v => v.name) || [],
            },
          } as ToolResponse),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: `Failed to create agent: ${error instanceof Error ? error.message : String(error)}`,
          } as ToolResponse),
        }],
      };
    }
  }
  );
}
