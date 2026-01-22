// File system utilities for Agent Builder

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

/**
 * Normalize agent name to directory name
 * Example: "My Agent" -> "my-agent"
 */
export function normalizeAgentName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/[\s_]+/g, '-')   // Convert spaces and underscores to hyphens
    .replace(/-+/g, '-')       // Collapse multiple hyphens
    .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
}

/**
 * Get the base agents directory path
 * Uses workspace from AgentrixContext
 */
export function getAgentsHomeDir(workspace: string): string {
  // Resolve ~ to home directory
  const resolvedWorkingDir = workspace.replace(/^~/, homedir());
  return resolvedWorkingDir;
}

/**
 * Resolve agent directory path from name
 */
export function resolveAgentDir(workspace: string, name: string): string {
  const normalizedName = normalizeAgentName(name);
  return join(getAgentsHomeDir(workspace), normalizedName);
}

/**
 * Check if directory exists
 */
export async function dirExists(path: string): Promise<boolean> {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if file exists
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Create directory recursively
 */
export async function ensureDir(path: string): Promise<void> {
  await fs.mkdir(path, { recursive: true });
}

/**
 * Write JSON file with pretty formatting
 */
export async function writeJson(path: string, data: any): Promise<void> {
  await fs.writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * Read JSON file
 */
export async function readJson(path: string): Promise<any> {
  const content = await fs.readFile(path, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write text file
 */
export async function writeText(path: string, content: string): Promise<void> {
  await fs.writeFile(path, content, 'utf-8');
}

/**
 * Read text file
 */
export async function readText(path: string): Promise<string> {
  return await fs.readFile(path, 'utf-8');
}

/**
 * Get agent structure paths
 */
export function getAgentPaths(workspace: string, name: string) {
  const agentDir = resolveAgentDir(workspace, name);
  return {
    agentDir,
    agentJson: join(agentDir, 'agent.json'),
    claudeDir: join(agentDir, 'claude'),
    claudeConfig: join(agentDir, 'claude', 'config.json'),
    systemPrompt: join(agentDir, 'claude', 'system_prompt.md'),
    pluginsDir: join(agentDir, 'claude', 'plugins'),
    configSchema: join(agentDir, 'config.schema.json'),
  };
}

/**
 * Get plugin paths
 */
export function getPluginPaths(workspace: string, name: string, pluginName: string) {
  const pluginDir = join(resolveAgentDir(workspace, name), 'claude', 'plugins', pluginName);
  return {
    pluginDir,
    manifestDir: join(pluginDir, '.claude-plugin'),
    manifest: join(pluginDir, '.claude-plugin', 'plugin.json'),
    skillsDir: join(pluginDir, 'skills'),
    hooksDir: join(pluginDir, 'hooks'),
    agentsDir: join(pluginDir, 'agents'),
    commandsDir: join(pluginDir, 'commands'),
    mcpConfig: join(pluginDir, '.mcp.json'),
    lspConfig: join(pluginDir, '.lsp.json'),
  };
}
