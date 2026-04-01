/**
 * Basic Context Usage
 * Synchronous methods — available immediately, no await needed.
 */

import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';
import { join } from 'path';
import { z } from 'zod';

export default function (context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'basic-context-example',
    version: '1.0.0',
    tools: [
      tool(
        'get_context_info',
        'Returns all basic context values',
        {},
        async () => {
          // Write execution log (appears in task log files)
          context.log('[get_context_info] tool called');

          const workspace = context.getWorkspace();   // "/workspace/abc123"
          const userId    = context.getUserId();       // "user-xxx"
          const taskId    = context.getTaskId();       // "task-xxx"
          const chatId    = context.getChatId();       // "chat-xxx"
          const rootId    = context.getRootTaskId();   // root of task tree
          const parentId  = context.getParentTaskId(); // null if root task

          // Build a path inside the workspace
          const outputFile = join(workspace, 'output', 'result.json');

          // Detect whether this is a sub-task
          const isSubTask = parentId !== null;

          // List all agents available in this chat  { displayName: agentId }
          const chatAgents = context.getChatAgents();
          // e.g. { "Code Reviewer": "agent-xxx", "Test Runner": "agent-yyy" }

          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                workspace, userId, taskId, chatId,
                rootId, parentId, isSubTask,
                outputFile,
                availableAgents: Object.keys(chatAgents),
              }, null, 2),
            }],
          };
        }
      ),
    ],
  });
}
