/**
 * User Communication
 * Push messages and modals to users watching the current task.
 *
 * sendMessage(target:'agent') — inject text as user input into a sub-task's agent
 * showModal()                 — trigger a modal dialog in the UI
 *
 * NOTE: sendMessage(target:'user') requires a full SDKAssistantMessage (wraps BetaMessage),
 * which is only available from an existing assistant response — not constructed manually.
 * Use showModal() for proactive UI notifications instead.
 */

import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';
import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';

function userMessage(text: string): SDKUserMessage {
  return {
    type: 'user',
    message: { role: 'user', content: text },
    parent_tool_use_id: null,
    session_id: '',
  };
}

export default function (context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'communication-example',
    version: '1.0.0',
    tools: [

      // ── Send input to a sub-task agent ────────────────────────────────────
      tool(
        'send_to_agent',
        'Inject a follow-up message as user input into a running sub-task',
        {
          taskId:  z.string().describe('Sub-task ID to target'),
          message: z.string().describe('Text to inject as user input'),
        },
        async (args) => {
          await context.sendMessage({
            taskId:  args.taskId,
            message: userMessage(args.message),
            target:  'agent',   // injects as user input into the agent worker
          });

          return { content: [{ type: 'text', text: 'Message sent to agent' }] };
        }
      ),

      // ── Show a modal dialog ───────────────────────────────────────────────
      tool(
        'show_try_agent_modal',
        'Show the try-draft-agent modal so the user can test the newly created agent',
        {
          draftAgentId:   z.string(),
          draftAgentName: z.string(),
        },
        async (args) => {
          await context.showModal({
            taskId:    context.getTaskId(),
            modalName: 'try-draft-agent',
            modalData: {
              draftAgentId:   args.draftAgentId,
              draftAgentName: args.draftAgentName,
            },
          });

          return { content: [{ type: 'text', text: 'Modal shown' }] };
        }
      ),

    ],
  });
}
