// Agent validation tools

import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { AgentrixContext } from '@agentrix/shared';
import {
  getAgentPaths,
  fileExists,
  dirExists,
  readJson,
} from '../utils/fileSystem.js';
import type { ToolResponse } from '../utils/types.js';

/**
 * Validate agent structure
 */
export function createValidateAgent(context: AgentrixContext) {
  return tool(
    'validate_agent',
    'Validate agent directory structure and configuration files',
    {
      name: z.string().describe('Agent name to validate'),
    },
    async (args) => {
      const workspace = context.getWorkspace();
      const paths = getAgentPaths(workspace, args.name);
      const errors: string[] = [];
      const warnings: string[] = [];

      try {
        // Check agent directory exists
        if (!(await dirExists(paths.agentDir))) {
          errors.push(`Agent directory does not exist: ${paths.agentDir}`);
          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: 'Agent directory does not exist',
                data: { errors },
              } as ToolResponse),
            }],
          };
        }

        // Check agent.json exists and is valid
        if (!(await fileExists(paths.agentJson))) {
          errors.push('agent.json not found');
        } else {
          try {
            const metadata = await readJson(paths.agentJson);
            if (!metadata.name) errors.push('agent.json: missing "name" field');
            if (!metadata.version) errors.push('agent.json: missing "version" field');
          } catch (error) {
            errors.push(`agent.json: invalid JSON - ${error instanceof Error ? error.message : String(error)}`);
          }
        }

        // Check .claude directory exists
        if (!(await dirExists(paths.claudeDir))) {
          errors.push('.claude directory not found');
        } else {
          // Check .claude/config.json exists and is valid
          if (!(await fileExists(paths.claudeConfig))) {
            errors.push('.claude/config.json not found');
          } else {
            try {
              const config = await readJson(paths.claudeConfig);
              if (!config.model) warnings.push('.claude/config.json: "model" not specified, will use default');

              // Check if system prompt file exists if referenced
              if (config.systemPrompt?.path) {
                const systemPromptPath = `${paths.claudeDir}/${config.systemPrompt.path}`;
                if (!(await fileExists(systemPromptPath))) {
                  errors.push(`System prompt file not found: ${config.systemPrompt.path}`);
                }
              }

              // Check if plugins exist
              if (config.plugins && Array.isArray(config.plugins)) {
                for (const pluginPath of config.plugins) {
                  const fullPluginPath = `${paths.claudeDir}/${pluginPath}`;
                  if (!(await dirExists(fullPluginPath))) {
                    errors.push(`Plugin directory not found: ${pluginPath}`);
                  } else {
                    // Check plugin manifest
                    const manifestPath = `${fullPluginPath}/.claude-plugin/plugin.json`;
                    if (!(await fileExists(manifestPath))) {
                      errors.push(`Plugin manifest not found: ${pluginPath}/.claude-plugin/plugin.json`);
                    }
                  }
                }
              }
            } catch (error) {
              errors.push(`.claude/config.json: invalid JSON - ${error instanceof Error ? error.message : String(error)}`);
            }
          }

          // Check plugins directory
          if (!(await dirExists(paths.pluginsDir))) {
            warnings.push('.claude/plugins directory not found (no plugins configured)');
          }
        }

        // Determine validation result
        const isValid = errors.length === 0;

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: isValid,
              message: isValid
                ? `Agent '${args.name}' validation passed` + (warnings.length > 0 ? ' with warnings' : '')
                : `Agent '${args.name}' validation failed`,
              data: {
                valid: isValid,
                errors,
                warnings,
                paths: {
                  agentDir: paths.agentDir,
                  agentJson: paths.agentJson,
                  claudeConfig: paths.claudeConfig,
                },
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
              error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
            } as ToolResponse),
          }],
        };
      }
    }
  );
}
