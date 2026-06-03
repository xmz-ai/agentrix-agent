# 心跳

_每次心跳都是一次短暂醒来：回顾、提取知识、微成长。_

## 例行流程

1. **先处理系统升级**：如果 `UPGRADES.md` 存在，必须先按其中的 Shadow instructions 应用升级
   - 读取 `UPGRADES.md` 和每个 ready upgrade 的 `.upgrade` 文件
   - 将 `New Content` 合入目标文件，更新对应 version marker
   - 删除已处理的 `.upgrade`；全部 ready upgrades 处理完且没有 blocked upgrades 时删除 `UPGRADES.md`
   - 升级检查不属于普通 heartbeat 行动，不能因为没有 memory/提醒事项就跳过

2. **回顾对话**：使用 read_conversation 查看最近讨论
   - 近期会话是否需要新建、更新或迭代 memory、USER.md、技能、summary 或 agent behavior？
   - 是否有状态变化需要同步，或有风险/遗漏需要提醒主 Companion？

3. **结构化知识审查** — 先想 CLASS-FIRST：发生了什么类别的活动？

   a) **用户画像** — 用户是否透露了偏好、习惯或专长？
      → 更新 USER.md

   b) **知识提取与整理** — 是否有值得长期保留的事实、决策、经验，或需要整理的旧记忆？
      → 使用 memory 技能写入、合并、遗忘过期细节，或强化 memory/ 下的 summary

   c) **技能发现** — 是否出现了可复用的工作流或模式？
      → 先查看 SKILLS.md，再决定创建或更新技能

4. **检查 durable 状态变化**
   - 查看近期对话、提醒和 active/open task 的目的，只是判断现有 durable memory 是否已经错误、过期，或是否缺少重要且已确认的决策。
   - 不要把任务进度写成记忆。不要记录“任务开始了”“任务进行中”“等待 review”“普通完成结果”、文件列表、验证日志、临时 task id/timestamp 或实现过程流水账。Memory 应保存 durable facts、用户偏好、已验证决策、稳定环境知识和重要纠正。
   - 如果信号来自 sub-task/executor report，只提取未来会话需要依赖的最小 current-state claim，不要把 report 转存进 memory。同一 workstream 已有 memory entry 时，优先重写/压缩成当前设计或状态，不要追加一串后续报告 bullet。
   - 只有当新证据会改变未来 Companion 会话应该相信或依赖的内容时，才更新 memory。例如：已记录的计划不再 current、用户偏好被纠正、原本不确定的事实变成 confirmed、外部 issue/PR 状态使已有 memory claim 失效。
   - 如果变化重要但需要主 Companion 判断或用户注意，发送简短提醒，而不是把过程性状态写入 memory。

5. **刷新外显形象**
   - 如果需要更新签名，用 send_reminder 建议主 Companion 更新
   - 不要每次都建议，只有在确有变化时才提醒

如果没有值得保存或行动的内容，安静退出。
