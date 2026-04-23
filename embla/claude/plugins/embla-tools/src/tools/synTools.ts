import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { AgentrixContext, AskUserResponseMessage } from '@agentrix/shared';
import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';
import * as fs from 'fs';
import * as path from 'path';

const CACHE_FILE = 'system-agent-ids.json';

async function getSynId(context: AgentrixContext): Promise<string> {
  const cacheDir = context.getAgentHomeDir();
  const cachePath = path.join(cacheDir, CACHE_FILE);

  if (fs.existsSync(cachePath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      if (cached['syn']) return cached['syn'];
    } catch {
      // corrupted cache — fall through
    }
  }

  const { agents, draftAgents } = await context.listAgents();
  const allAgents = [
    ...agents.map((a: any) => ({ id: a.id, name: (a.displayName || a.name).toLowerCase() })),
    ...draftAgents.map((a: any) => ({ id: a.id, name: (a.displayName || a.name).toLowerCase() })),
  ];

  const embla = allAgents.find((a: any) => a.name === 'embla');
  const syn = allAgents.find((a: any) => a.name === 'syn');

  if (!embla) throw new Error('Embla agent not found');
  if (!syn) throw new Error('Syn agent not found');

  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify({ embla: embla.id, syn: syn.id }, null, 2), 'utf-8');

  return syn.id;
}

export function createEmitToTask(context: AgentrixContext) {
  return tool(
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
  );
}

export function createStartSynTest(context: AgentrixContext) {
  return tool(
    'start_syn_test',
    'Start Syn as a sub-task to test a draft agent. Syn\'s ID is resolved automatically. After calling this, you will receive a <sub-task-result> callback with Syn\'s findings. Save the returned taskId to use with emit_to_task for follow-up rounds.',
    {
      draftAgentId: z.string().describe('The draft agent ID to test'),
      requirements: z.string().describe('The original user requirements — what the agent is supposed to do'),
    },
    async (args) => {
      try {
        const synId = await getSynId(context);

        const message: SDKUserMessage = {
          type: 'user',
          message: {
            role: 'user',
            content: `Draft agent ID: ${args.draftAgentId}\n\nUser requirements: ${args.requirements}`,
          },
          parent_tool_use_id: null,
          session_id: '',
        };

        const { taskId } = await context.startSubTask({
          agentId: synId,
          message,
          title: `Test: ${args.draftAgentId}`,
        });

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              taskId,
              note: 'Syn is now testing the agent. Wait for the <sub-task-result> callback. Use emit_to_task with this taskId for follow-up rounds.',
            }),
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              error: `Failed to start Syn test: ${error instanceof Error ? error.message : String(error)}`,
            }),
          }],
        };
      }
    }
  );
}
