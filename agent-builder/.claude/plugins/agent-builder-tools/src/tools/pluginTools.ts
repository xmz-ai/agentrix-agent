// Plugin creation and management tools

import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { AgentrixContext } from '@agentrix/shared';
import {
  getPluginPaths,
  ensureDir,
  writeJson,
  writeText,
  dirExists,
  fileExists,
} from '../utils/fileSystem.js';
import type { PluginManifest, ToolResponse } from '../utils/types.js';

/**
 * Create a plugin with manifest
 * NOTE: plugin.json should ONLY contain basic metadata (name, description, version, author)
 */
export function createCreatePlugin(context: AgentrixContext) {
  return tool(
    'create_plugin',
    'Create a plugin directory structure with .claude-plugin/plugin.json manifest (metadata only)',
    {
      name: z.string().describe('Agent name'),
      pluginName: z.string().regex(/^[a-z0-9-]+$/).describe('Plugin name (lowercase, hyphens only)'),
      description: z.string().describe('Plugin description'),
      version: z.string().default('1.0.0').describe('Plugin version'),
      authorName: z.string().optional().describe('Plugin author name'),
    },
    async (args) => {
      const workspace = context.getWorkspace();
      const paths = getPluginPaths(workspace, args.name, args.pluginName);

      if (await dirExists(paths.pluginDir)) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              error: `Plugin '${args.pluginName}' already exists`,
            } as ToolResponse),
          }],
        };
      }

      try {
        // Create plugin directories
        await ensureDir(paths.manifestDir);

        // Create manifest with ONLY basic metadata
        const manifest: PluginManifest = {
          name: args.pluginName,
          description: args.description,
          version: args.version,
        };

        if (args.authorName) {
          manifest.author = {
            name: args.authorName,
          };
        }

        await writeJson(paths.manifest, manifest);

        // Create placeholder README
        const readme = `# ${args.pluginName}\n\n${args.description}\n\n## Structure\n\nThis plugin can contain:\n- skills/ - Agent skills (SKILL.md format)\n- hooks/ - Event hooks (hooks.json)\n- agents/ - Sub-agents\n- commands/ - Slash commands (*.md)\n- .mcp.json - MCP server config\n- .lsp.json - LSP server config\n`;
        await writeText(`${paths.pluginDir}/README.md`, readme);

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              message: `Created plugin '${args.pluginName}' at ${paths.pluginDir}`,
              data: {
                pluginDir: paths.pluginDir,
                manifest: paths.manifest,
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
              error: `Failed to create plugin: ${error instanceof Error ? error.message : String(error)}`,
            } as ToolResponse),
          }],
        };
      }
    }
  );
}

