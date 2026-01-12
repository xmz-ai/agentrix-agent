// Agent structure creation tools

import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { AgentrixContext } from '@agentrix/shared';
import {
  getAgentPaths,
  dirExists,
  ensureDir,
  writeJson,
  writeText,
  normalizeAgentName,
} from '../utils/fileSystem.js';
import type {
  AgentMetadata,
  ClaudeConfig,
  ToolResponse,
} from '../utils/types.js';

/**
 * Create complete agent structure with all base files
 * Replaces: createAgentDirectory, writeAgentMetadata, writeClaudeConfig, writeSystemPrompt
 */
export function createWriteAgentStructure(context: AgentrixContext) {
  return tool(
    'write_agent_structure',
    'Create complete agent directory structure with agent.json, .claude/config.json, and optionally system_prompt.md. Call this FIRST.',
    {
      name: z.string().describe('Agent name (will be normalized to directory name, e.g., "My Agent" → "my-agent")'),
      displayName: z.string().optional().describe('Agent display name (defaults to name if not provided)'),
      version: z.string().default('1.0.0').describe('Agent version'),
      description: z.string().optional().describe('Agent description'),
      maxTurns: z.number().optional().describe('Maximum conversation turns'),
      systemPromptPath: z.string().optional().describe('Path to system prompt file (relative to .claude/)'),
      systemPromptMode: z.enum(['append', 'replace']).default('append').describe('System prompt mode'),
      systemPromptContent: z.string().optional().describe('System prompt content (creates .claude/system_prompt.md if provided)'),
      allowedTools: z.array(z.string()).optional().describe('Allowed tool patterns'),
      plugins: z.array(z.string()).optional().describe('Plugin paths to load'),
    },
    async (args) => {
      const workspace = context.getWorkspace();
      const paths = getAgentPaths(workspace, args.name);
      const normalizedName = normalizeAgentName(args.name);

      // Check if agent already exists
      if (await dirExists(paths.agentDir)) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              error: `Agent '${normalizedName}' already exists at ${paths.agentDir}`,
            }),
          }],
        };
      }

      try {
        // Create directory structure
        await ensureDir(paths.agentDir);
        await ensureDir(paths.claudeDir);
        await ensureDir(paths.pluginsDir);

        // Create agent.json
        const metadata: AgentMetadata = {
          name: args.displayName || args.name,
          version: args.version,
        };
        if (args.description) {
          metadata.description = args.description;
        }
        await writeJson(paths.agentJson, metadata);

        // Create .claude/config.json
        const config: ClaudeConfig = {};
        if (args.maxTurns !== undefined) config.maxTurns = args.maxTurns;
        if (args.systemPromptPath || args.systemPromptContent) {
          config.systemPrompt = {
            path: args.systemPromptPath || 'system_prompt.md',
            mode: args.systemPromptMode,
          };
        }

        // Settings object for permissionMode and allowedTools
        if (args.allowedTools) {
          config.settings = {};
          config.settings.permissionMode = 'bypassPermissions';
          if (args.allowedTools) config.settings.allowedTools = args.allowedTools;
        }

        // NOTE: plugins field should NOT be set - plugins are auto-discovered
        // Only set sdkMcpTools if provided
        if (args.plugins) {
          config.sdkMcpTools = args.plugins;
        }

        await writeJson(paths.claudeConfig, config);

        // Create system prompt if content provided
        if (args.systemPromptContent) {
          const systemPromptPath = `${paths.claudeDir}/${config.systemPrompt?.path || 'system_prompt.md'}`;
          await writeText(systemPromptPath, args.systemPromptContent);
        }

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              message: `Created agent structure for '${args.name}'`,
              data: {
                name: args.name,
                normalizedName,
                agentDir: paths.agentDir,
                filesCreated: [
                  'agent.json',
                  '.claude/config.json',
                  args.systemPromptContent ? '.claude/system_prompt.md' : null,
                ].filter(Boolean),
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
              error: `Failed to create agent structure: ${error instanceof Error ? error.message : String(error)}`,
            } as ToolResponse),
          }],
        };
      }
    }
  );
}
