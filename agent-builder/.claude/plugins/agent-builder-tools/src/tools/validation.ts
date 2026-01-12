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
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Validate skill directory structure within a plugin
 * Skills must be in plugins/{plugin-name}/skills/{skill-name}/SKILL.md
 * NOT in plugins/{plugin-name}/SKILL.md
 */
async function validateSkillStructure(
  pluginPath: string,
  pluginRelPath: string,
  errors: string[]
): Promise<void> {
  try {
    // Check if there's a SKILL.md directly in the plugin root (incorrect location)
    const rootSkillPath = path.join(pluginPath, 'SKILL.md');
    if (await fileExists(rootSkillPath)) {
      errors.push(
        `Invalid skill location in plugin '${pluginRelPath}': SKILL.md found at plugin root. ` +
        `Skills must be in 'skills/{skill-name}/SKILL.md' subdirectory, not at plugin root.`
      );
    }

    // Check if skills directory exists
    const skillsDir = path.join(pluginPath, 'skills');
    if (await dirExists(skillsDir)) {
      // Check each subdirectory in skills/
      const entries = await fs.readdir(skillsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
          if (!(await fileExists(skillPath))) {
            errors.push(
              `Missing SKILL.md in plugin '${pluginRelPath}': ` +
              `Expected file at 'skills/${entry.name}/SKILL.md'`
            );
          }
        }
      }
    }
  } catch (error) {
    // If we can't read the directory, just skip the validation
    // The error will be caught elsewhere
  }
}

/**
 * Validate command directory structure within a plugin
 * Commands must be in plugins/{plugin-name}/commands/{command-name}.md
 * NOT in .claude/commands/{command-name}.md
 */
async function validateCommandStructure(
  pluginPath: string,
  pluginRelPath: string,
  errors: string[]
): Promise<void> {
  try {
    // Check if commands directory exists
    const commandsDir = path.join(pluginPath, 'commands');
    if (await dirExists(commandsDir)) {
      // Check that all files are .md files
      const entries = await fs.readdir(commandsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile() && !entry.name.endsWith('.md')) {
          errors.push(
            `Invalid command file in plugin '${pluginRelPath}': ` +
            `'commands/${entry.name}' must be a .md file`
          );
        }
      }
    }
  } catch (error) {
    // If we can't read the directory, just skip the validation
  }
}

/**
 * Validate that commands are not in .claude/commands/
 * Commands must be in plugins, not at agent root
 */
async function validateNoRootCommands(
  claudeDir: string,
  errors: string[]
): Promise<void> {
  try {
    const rootCommandsDir = path.join(claudeDir, 'commands');
    if (await dirExists(rootCommandsDir)) {
      errors.push(
        `Invalid commands location: Found '.claude/commands/' directory. ` +
        `Commands must be in 'plugins/{plugin-name}/commands/', not at .claude root.`
      );
    }
  } catch (error) {
    // If we can't check the directory, just skip
  }
}

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

                    // Validate skill directory structure
                    await validateSkillStructure(fullPluginPath, pluginPath, errors);

                    // Validate command directory structure
                    await validateCommandStructure(fullPluginPath, pluginPath, errors);
                  }
                }
              }
            } catch (error) {
              errors.push(`.claude/config.json: invalid JSON - ${error instanceof Error ? error.message : String(error)}`);
            }
          }

          // Check that commands are not in .claude/commands/
          await validateNoRootCommands(paths.claudeDir, errors);

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
