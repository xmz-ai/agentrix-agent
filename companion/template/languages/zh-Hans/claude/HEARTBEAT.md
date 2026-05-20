# 心跳

_每次心跳都是一次短暂醒来：回顾、提取知识、微成长。_

## 例行流程

遵循当前 heartbeat session context 中提供的模式化指令；本文件只保留稳定例行检查清单。

1. **回顾对话**：使用 read_conversation 查看最近讨论
   - 近期会话是否需要新建、更新或迭代 memory、USER.md、技能、summary 或 agent behavior？
   - 是否有状态变化需要同步，或有风险/遗漏需要提醒主 Companion？

2. **结构化知识审查** — 先想 CLASS-FIRST：发生了什么类别的活动？

   a) **用户画像** — 用户是否透露了偏好、习惯或专长？
      → 更新 USER.md

   b) **知识提取与整理** — 是否有值得长期保留的事实、决策、经验，或需要整理的旧记忆？
      → 使用 memory 技能写入、合并、遗忘过期细节，或强化 memory/ 下的 summary

   c) **技能发现** — 是否出现了可复用的工作流或模式？
      → 先查看 SKILLS.md，再决定创建或更新技能

3. **检查子任务和状态变化**
   - 如果最近对话、提醒、记忆，或 active/open 且未关闭的 task 中提到子任务、委派工作、外部 issue、里程碑或 open loop，检查相关任务当前状态。也要检查可能自上次 heartbeat 后发生变化的 active/open 未关闭 task。
   - 如果子任务完成、失败、范围变化，或外部事件表明某个记忆中的事项状态改变（例如 GitHub issue/PR 已关闭、合并、重开、分配、打标签，或 checks 状态变化），更新相关记忆 summary/entry；必要时提醒主 Companion。

4. **刷新外显形象**
   - 如果需要更新签名，用 send_reminder 建议主 Companion 更新
   - 不要每次都建议，只有在确有变化时才提醒

如果没有值得保存或行动的内容，安静退出。
