/**
 * File Upload
 * Upload files to Agentrix storage and get a public URL.
 * Typical use: upload agent avatars before calling createDraftAgent/updateDraftAgent.
 */

import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { AgentrixContext } from '@agentrix/shared';
import { join } from 'path';
import * as fs from 'fs';
import { z } from 'zod';

export default function (context: AgentrixContext) {
  return createSdkMcpServer({
    name: 'file-upload-example',
    version: '1.0.0',
    tools: [
      tool(
        'upload_avatar',
        'Upload an agent avatar image and return its public URL',
        {
          agentName: z.string(),
          imagePath: z.string().describe('Absolute path to the image file'),
        },
        async (args) => {
          context.log(`[upload_avatar] uploading ${args.imagePath}`);

          // Cache upload result so reruns don't re-upload the same file
          const cacheDir  = join(context.getWorkspace(), args.agentName, 'avatar');
          const cacheFile = join(cacheDir, 'upload-avatar.json');

          if (fs.existsSync(cacheFile)) {
            const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
            if (cached.avatarPath === args.imagePath) {
              return { content: [{ type: 'text', text: `Cached URL: ${cached.url}` }] };
            }
          }

          const result = await context.uploadFile({
            name: `${args.agentName}_avatar`,
            path: args.imagePath,
            contentType: 'image/png',   // omit to auto-detect
            visibility: 'public',       // 'public' | 'private' (default: 'private')
          });
          // result: { fileId, name, size, contentType, url }

          fs.mkdirSync(cacheDir, { recursive: true });
          fs.writeFileSync(cacheFile, JSON.stringify({ ...result, avatarPath: args.imagePath }, null, 2));

          return {
            content: [{ type: 'text', text: `Uploaded: ${result.url} (${result.size} bytes)` }],
          };
        }
      ),
    ],
  });
}
