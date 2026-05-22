import { cp, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { HookFactory } from '@agentrix/shared';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = join(CURRENT_DIR, '..', 'templates');

const FIXED_TEMPLATE_PATHS = [
  '.agentrix/README.md',
  '.agentrix/prompt.md',
  '.agentrix/plugins/agentrix-devops/skills/agentrix-development-workflow',
  '.agentrix/plugins/agentrix-devops/skills/agentrix-test-memory',
  '.agentrix/plugins/agentrix-devops/skills/webapp-testing',
  '.agentrix/env/test/README.md',
];

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyTemplate(workspace: string, relativePath: string): Promise<'created' | 'exists' | 'partial' | 'missing-template'> {
  const source = join(TEMPLATE_ROOT, relativePath);
  const target = join(workspace, relativePath);

  if (!(await pathExists(source))) {
    return 'missing-template';
  }

  const sourceStat = await stat(source);

  if (sourceStat.isFile()) {
    if (await pathExists(target)) {
      return 'exists';
    }

    await mkdir(dirname(target), { recursive: true });
    await cp(source, target, { errorOnExist: false, force: false });
    return 'created';
  }

  let createdCount = 0;
  let existingCount = 0;

  async function copyDirectory(sourceDir: string, targetDir: string): Promise<void> {
    await mkdir(targetDir, { recursive: true });
    const entries = await readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const childSource = join(sourceDir, entry.name);
      const childTarget = join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(childSource, childTarget);
        continue;
      }

      if (await pathExists(childTarget)) {
        existingCount += 1;
        continue;
      }

      await mkdir(dirname(childTarget), { recursive: true });
      await cp(childSource, childTarget, { errorOnExist: false, force: false });
      createdCount += 1;
    }
  }

  await copyDirectory(source, target);

  if (createdCount === 0 && existingCount > 0) {
    return 'exists';
  }

  if (createdCount > 0 && existingCount > 0) {
    return 'partial';
  }

  return 'created';
}

async function ensureEnvDirectories(workspace: string): Promise<void> {
  const dirs = [
    '.agentrix/env/modes',
    '.agentrix/env/init/state/local',
    '.agentrix/env/init/state/remote',
    '.agentrix/env/test/workflows',
    '.agentrix/env/test/lessons',
  ];

  for (const dir of dirs) {
    await mkdir(join(workspace, dir), { recursive: true });
  }
}

const createHooks: HookFactory = (context) => {
  return {
    SessionStart: async () => {
      const workspace = context.getWorkspace();
      for (const relativePath of FIXED_TEMPLATE_PATHS) {
        await copyTemplate(workspace, relativePath);
      }

      await ensureEnvDirectories(workspace);

      return {};
    },
  };
};

export default createHooks;
