import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import type { AgentrixContext, AskUserResponseMessage } from '@agentrix/shared';
import { z } from 'zod';
import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';

export default function (context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'tester-tools',
    version: '1.0.0',
    tools: [
      tool(
        'list_draft_agents',
        'List all draft agents available for testing. Returns agent id, name, and description.',
        {},
        async () => {
          try {
            const { draftAgents } = await context.listAgents();
            return {
              content: [{
                type: 'text' as const,
                text: JSON.stringify({
                  success: true,
                  draftAgents: draftAgents.map((a: any) => ({
                    id: a.id,
                    name: a.displayName || a.name,
                    description: a.description ?? '',
                  })),
                }),
              }],
            };
          } catch (error) {
            return {
              content: [{
                type: 'text' as const,
                text: JSON.stringify({
                  success: false,
                  error: `Failed to list agents: ${error instanceof Error ? error.message : String(error)}`,
                }),
              }],
            };
          }
        }
      ),

      tool(
        'emit_to_task',
        `Send a message to a running sub-task. Use this to:
1. Answer a sub-task's ask_user questions: set answers array (one answer per question).
2. Send follow-up instructions: set message only (no answers).`,
        {
          taskId: z.string().describe('The sub-task ID to send the message to'),
          message: z.string().optional().describe('Follow-up message for the sub-task (used when not answering ask_user)'),
          answers: z.array(z.string()).optional().describe('Answers to the sub-task ask_user questions, one per question. When provided, sends as ask_user_response.'),
        },
        async (args) => {
          try {
            let payload: any;
            if (args.answers && args.answers.length > 0) {
              const askUserResponse: AskUserResponseMessage = {
                type: 'ask_user_response',
                answers: args.answers,
              };
              payload = askUserResponse;
            } else {
              payload = {
                type: 'user',
                message: { role: 'user', content: args.message ?? '' },
                parent_tool_use_id: null,
                session_id: '',
              } as SDKUserMessage;
            }
            await context.sendMessage({
              taskId: args.taskId,
              message: payload,
              target: 'agent',
            });
            return {
              content: [{ type: 'text' as const, text: JSON.stringify({ success: true }) }],
            };
          } catch (error) {
            return {
              content: [{ type: 'text' as const, text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }) }],
            };
          }
        }
      ),

      tool(
        'start_test_session',
        'Start a test session by sending a message to a draft agent as a sub-task. After calling this, you will automatically receive a <sub-task-result> XML message with the agent\'s response — no polling needed.',
        {
          agentId: z.string().describe('The draft agent ID to test'),
          testMessage: z.string().describe('The test message to send to the agent'),
          title: z.string().optional().describe('Optional title for the test session'),
        },
        async (args) => {
          try {
            const message: SDKUserMessage = {
              type: 'user',
              message: { role: 'user', content: args.testMessage },
              parent_tool_use_id: null,
              session_id: '',
            };

            const { taskId } = await context.startSubTask({
              agentId: args.agentId,
              message,
              title: args.title ?? `Test: ${args.testMessage.slice(0, 50)}`,
            });

            return {
              content: [{
                type: 'text' as const,
                text: JSON.stringify({
                  success: true,
                  taskId,
                  note: 'Test session started. Wait for the <sub-task-result> XML message to receive the agent\'s response.',
                }),
              }],
            };
          } catch (error) {
            return {
              content: [{
                type: 'text' as const,
                text: JSON.stringify({
                  success: false,
                  error: `Failed to start test session: ${error instanceof Error ? error.message : String(error)}`,
                }),
              }],
            };
          }
        }
      ),
    ],
  });
}
