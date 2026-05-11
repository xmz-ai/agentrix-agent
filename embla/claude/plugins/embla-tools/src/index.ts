import { createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import type { AgentrixContext } from '@agentrix/shared';

import { createWriteAgentStructure } from './tools/agentStructure.js';
import { createCreatePlugin } from './tools/pluginTools.js';
import { createValidateAgent } from './tools/validation.js';
import { createSaveAgentInDb } from './tools/databaseTools.js';
import { createStartSynTest, createEmitToTask } from './tools/synTools.js';
import {
  createHiveComment,
  createHivePrepareRepository,
  createHivePublish,
  createHiveRecordInstall,
  createHiveReview,
  createHiveUpdate,
  createShowDraftAgentActions,
} from './tools/hiveTools.js';

export default function(context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'embla-tools',
    version: '2.0.0',
    tools: [
      createWriteAgentStructure(context),
      createCreatePlugin(context),
      createSaveAgentInDb(context),
      createValidateAgent(context),
      createStartSynTest(context),
      createEmitToTask(context),
      createHivePrepareRepository(context),
      createHivePublish(context),
      createHiveUpdate(context),
      createHiveRecordInstall(context),
      createHiveReview(context),
      createHiveComment(context),
      createShowDraftAgentActions(context),
    ],
  });
}
