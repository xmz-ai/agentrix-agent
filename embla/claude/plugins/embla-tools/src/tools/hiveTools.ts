import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { AgentrixContext } from '@agentrix/shared';

function json(data: unknown) {
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify(data, null, 2),
    }],
  };
}

function getContext(context: AgentrixContext): any {
  return context as any;
}

export function createHivePrepareRepository(context: AgentrixContext) {
  return tool(
    'hive_prepare_repository',
    `Prepare the Agentrix Hive source repository in the local global repo store.

Use this before discovering community agents or skills. This only clones/pulls
the repository and returns the absolute checkout path. Use Explore with a
task-specific goal to find relevant candidates; do not catalog the whole repo
unless the user explicitly asks for a catalog.`,
    {},
    async () => {
      try {
        const result = await getContext(context).prepareHiveRepository();
        return json({ success: true, data: result });
      } catch (error) {
        return json({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
  );
}

export function createHivePublish(context: AgentrixContext) {
  return tool(
    'hive_publish',
    `Publish a newly created agent or skill to Agentrix Hive after the user explicitly agrees.

Use this for content created by Embla/the user. Do not republish someone else's
installed Hive content. Exactly one of machineId or cloudId is required by the
platform publish API.`,
    {
      type: z.enum(['agent', 'skill']),
      draftAgentId: z.string().optional().describe('DraftAgent ID for agent publishing'),
      sourceDir: z.string().optional().describe('Absolute local skill directory for skill publishing'),
      name: z.string().optional().describe('Listing name, lowercase kebab-case'),
      displayName: z.string().optional().describe('Human-readable listing name'),
      description: z.string().optional(),
      readme: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      machineId: z.string().optional(),
      cloudId: z.string().optional(),
    },
    async (args) => {
      try {
        const result = await getContext(context).publishToHive({
          ...args,
          authorType: 'user',
          authorId: context.getUserId(),
        });
        return json({ success: true, data: result });
      } catch (error) {
        return json({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
  );
}

export function createHiveUpdate(context: AgentrixContext) {
  return tool(
    'hive_update',
    `Publish a new version for an owned Hive listing after the user explicitly agrees.

Use only for listings owned by the user/agent. For someone else's installed Hive
content, keep changes local and leave a Hive comment instead.`,
    {
      listingId: z.string().describe('Owned HiveListing ID to update'),
      version: z.string().optional().describe('Optional new version; defaults to next patch version'),
      changelog: z.string().optional(),
      sourceDir: z.string().optional().describe('Absolute local skill directory for skill listing updates'),
      machineId: z.string().optional(),
      cloudId: z.string().optional(),
    },
    async (args) => {
      try {
        const { listingId, ...request } = args;
        const result = await getContext(context).updateHiveListingVersion(listingId, request);
        return json({ success: true, data: result });
      } catch (error) {
        return json({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
  );
}

export function createHiveRecordInstall(context: AgentrixContext) {
  return tool(
    'hive_record_install',
    `Record a Hive agent or skill after installing it locally.

Do not use this tool to install. First inspect the Hive source, perform the local
install, then read the HiveListing ID from agentrix-hive-id.txt in the Hive source
directory and pass it as listingId.`,
    {
      listingId: z.string().describe('HiveListing ID read from agentrix-hive-id.txt in the Hive source directory'),
      agentDir: z.string().describe('Absolute local directory where the agent or skill was installed'),
      name: z.string().optional().describe('Optional local name for installed agent'),
      machineId: z.string().optional(),
      cloudId: z.string().optional(),
      installedVersion: z.string().optional(),
    },
    async (args) => {
      try {
        const { listingId, ...request } = args;
        const result = await getContext(context).recordHiveInstall(listingId, request);
        return json({ success: true, data: result });
      } catch (error) {
        return json({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
  );
}

export function createHiveReview(context: AgentrixContext) {
  return tool(
    'hive_review',
    'Leave or update structured feedback for a Hive listing after using it or evaluating user/Syn feedback.',
    {
      listingId: z.string().describe('HiveListing ID'),
      rating: z.number().int().min(1).max(5),
      comment: z.string().optional().describe('Markdown review text'),
    },
    async (args) => {
      try {
        const result = await getContext(context).createHiveReview(args.listingId, {
          rating: args.rating,
          comment: args.comment ?? null,
        });
        return json({ success: true, data: result });
      } catch (error) {
        return json({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
  );
}

export function createHiveComment(context: AgentrixContext) {
  return tool(
    'hive_comment',
    'Leave a discussion comment, bug report, usage suggestion, or reply for a Hive listing.',
    {
      listingId: z.string().describe('HiveListing ID'),
      content: z.string().min(1).describe('Markdown comment content'),
      parentId: z.string().optional().describe('Parent comment ID for replies'),
    },
    async (args) => {
      try {
        const result = await getContext(context).createHiveComment(args.listingId, {
          content: args.content,
          parentId: args.parentId,
        });
        return json({ success: true, data: result });
      } catch (error) {
        return json({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
  );
}

export function createShowDraftAgentActions(context: AgentrixContext) {
  return tool(
    'show_draft_agent_actions',
    'Show the side action entry for a newly created draft agent. The UI provides Try it and Publish actions.',
    {
      draftAgentId: z.string(),
      draftAgentName: z.string(),
    },
    async (args) => {
      try {
        await getContext(context).showModal({
          taskId: context.getTaskId(),
          modalName: 'try-draft-agent',
          modalData: {
            draftAgentId: args.draftAgentId,
            draftAgentName: args.draftAgentName,
          },
        });
        return json({ success: true });
      } catch (error) {
        return json({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
  );
}
