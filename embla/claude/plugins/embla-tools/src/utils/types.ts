// Type definitions for Agent Builder MCP tools

export interface AgentMetadata {
  name: string;
  version: string;
  description?: string;
}

export interface ClaudeConfig {
  model?: string;
  fallbackModel?: string;
  maxTurns?: number;
  systemPrompt?: {
    path: string;
    mode: 'append' | 'replace';
  };
  settings?: {
    permissionMode?: 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
    allowedTools?: string[];
  };
  // NOTE: NO plugins field - plugins are auto-discovered from claude/plugins/
  sdkMcpTools?: string[]; // Scripts that export createSdkMcpServer()
  pullRequestPrompt?: {
    path: string;
    mode: 'append' | 'replace';
  };
  extraArgs?: Record<string, string | null>;
}

export interface PluginManifest {
  name: string;
  description: string;
  version: string;
  author?: {
    name: string;
  };
  // NOTE: NO main, type, or other fields - only basic metadata
}

export interface ToolResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}
