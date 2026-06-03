# 记忆整理

_这是一次聚焦的 Companion 记忆维护。核心工作是整理已有 memory，让未来会话读到的记忆更准、更短、更有用。_

## 核心目标

整理 memory，不是记录活动，也不是复盘所有任务。每次运行都围绕一个问题：**现有 memory 里哪些内容会让未来 Companion 误判、漏判、重复读取，或花太多 token 才能理解当前状态？**

需要整理的 memory 通常有这些信号：

- **冲突**：两条 memory 或 memory 与近期对话/任务信号不可能同时为真。
- **过期**：memory 里的状态、偏好、方向、workflow、环境事实已经被新的用户纠正、决策或任务结果取代。
- **错误**：memory 本身是误记、幻觉、误解用户意思，或被可靠证据推翻。
- **重复堆积**：多条 entries 反复表达同一件事，未来读取不会得到新信息，只会增加噪音。
- **碎片化**：同一主题散落在很多小 entries 里，未来需要读很多文件才能拼出当前结论。
- **summary 薄弱**：`memory/{topic}/memory.md` 没有反映 entries 的当前结论，或仍保留过多历史过程。
- **当前事实缺失**：近期对话/任务里出现了 durable fact，但相关 topic summary 没有更新，未来 Companion 会漏掉这个事实。
- **过度冗长**：summary 或 entry 保留了任务流水、文件列表、验证日志、阶段性状态，超过未来判断所需。
- **索引失真**：`MEMORY.md` 或 topic index 的描述、分类、confidence/source/status 已经不能帮助定位和判断可信度。

没有这些信号时，不要为了定时运行而改 memory。

## 范围

审查并维护当前 Companion agent home 里的记忆：

- `MEMORY.md`
- `memory/{topic}/memory.md`
- `memory/{topic}/YYYY-MM-DD-slug.md`

不要读取 `memory-changes/` 这类记忆变更审计日志；它们只是 bookkeeping，不是记忆输入。

你的目标是维护 Companion 记忆质量，而不是生成活动流水账。

近期对话、active/open tasks、任务历史、提醒和已有 memory entries 都是本次整理的输入信号。用它们发现 memory 是否已经出现上述整理信号。

不要记录每个近期事件。不要保留中间任务状态，除非它改变了未来会话需要依赖的 durable fact。

仓库文件和 task workspace 不是常规扫描范围。只有某条记忆声明或任务信号需要快速核对时，才读取相关 commit、issue、文件、任务结果或外部状态。

## 整理方法：先分层，再压缩

当一个 topic 开始变得难读，先判断问题属于哪一层，不要只在原文件里继续追加。

**难读标准**：满足一两条就是整理信号，不是机械阈值；重点看未来 Companion 是否会误判或多花 token。

- 不能用一句话说清这个 topic 的长期认知边界，或者一句话里必须塞多个互不依赖的方向。
- Summary 超过 memory skill 的预算，或读完 summary 仍不知道当前结论是什么。
- Summary 需要列很多“后续修正 / 见某条 entry / 但又后来……”才能解释现状。
- 未来会话为了回答普通问题，需要连续打开 3 个以上 entries 才能拼出当前状态。
- Index 的二级分组已经像多个独立 topic，而不是同一 topic 下的子领域。
- 同一个 workstream 有多条 entry 或很多 bullet 反复记录 executor report、验证结果、文件列表、临时状态。
- 最新的 durable fact 被埋在历史过程后面，或者旧 current claim 和新事实混在一起。

1. **Topic 层：该不该拆分？**
   - 如果 topic 命中上面的“长期认知边界不清”“summary 同时解释多个长期方向”“index 已经像多个独立 topic”等信号，说明 topic 太宽。
   - 拆分标准是长期认知边界，不是任务边界：例如“Agentrix 核心运行时”和“Companion 记忆/心跳/上下文维护”是不同主题；某个 issue 或某天的子任务不是新 topic。
   - 拆分后，`MEMORY.md` 只保留新 topic 的一句话地图；原 topic summary 改成指向专门 topic，而不是保留完整历史。

2. **Summary 层：只保留当前判断**
   - Summary 回答“未来 Companion 现在应该相信什么”。
   - 把已迁出的方向、过期过程、executor 报告链、验证日志、文件列表移出 summary。
   - 如果某个 current fact 需要 caveat，写一句 caveat；不要用 caveat 承载完整过程。

3. **Entry 层：把流水账折叠成当前状态**
   - 同一 workstream 的多次子任务报告不要逐条 append。
   - 重写成“当前设计事实 + 仍需验证/接受的短 caveat + 必要来源指针”。
   - 临时 task id、timestamp、build 命令、touched files、日志结论留在 task history/git，不进 memory，除非它本身是未来判断必须依赖的稳定事实。

4. **Index 层：保留导航和 provenance**
   - Index 不是第二份 summary。每个 entry 一句话说明它为什么还值得打开。
   - 被迁移到新 topic 的 entry，从原 topic index 删除，加入新 topic index。
   - 过期但有解释价值的历史，只在 index/provenance 留短 trace；错误内容直接删。

5. **优先顺序**
   - 先修会误导未来判断的 summary。
   - 再拆分过宽 topic。
   - 再压缩同一 workstream 的 entry。
   - 最后才考虑删除旧文件；能靠 topic/index 重组解决的，不要机械删除。

## 检查清单

1. **使用记忆 skill**
   - 使用 memory skill 来做记忆管理和整理决策。
   - 应用 memory skill 里的 summary budget、confidence/source/status、expired-vs-erroneous 区分，以及“memory is not an activity log”规则。

2. **先收集当前信号**
   - 使用 `read_conversation` 阅读 Companion chat/root chat 的近期对话，找出用户纠正、决策、偏好变化、项目方向变化、环境事实变化和 durable facts。
   - 使用 `list_tasks` 查看 active/open tasks，先知道当前有哪些未完成或长期存在的上下文。
   - 对相关任务使用 `get_task_history`，特别是任务历史可能解释某条 memory 冲突、状态过期、任务结论变化或 durable decision 时。
   - 把 reminders 当作信号：它们可能指向当前义务、过期 follow-up，或主 Companion 本应依赖的事实。
   - 阅读 `MEMORY.md`，理解 topic map，并选择可能受这些信号影响的 topics。

3. **把信号和 memory 对照**
   - 先读 topic summary，再打开 individual entries。
   - 对每个相关 topic 问：未来 Companion 只读 summary 会不会得到正确、当前、足够压缩的判断？
   - 如果 summary 与近期信号不一致，更新 summary。
   - 如果 entries 互相重复或散乱，合并、压缩或改 index，让当前结论更容易被读取。
   - 如果旧事实已经 expired，把它从 current summary 移走；需要保留历史原因时，只在 index/provenance 里简短保留。
   - 如果旧事实是 erroneous，删除错误表达，只保留 corrected current fact。
   - 如果 current durable fact 缺失，补到相关 summary 或 entry，而不是追加流水账。

4. **保守编辑**
   - 优先更新 topic summary，不要一上来重写大量 individual entries。
   - 只有在合并后仍然清晰、可追踪时才合并重复项。
   - 只有在事实明显过期、冗余、错误或会误导未来判断时才删除。
   - 如果仍有不确定性，把不确定性写进记忆，不要制造虚假的确定性。
   - 不要因为读取了对话就总结或归档对话；只写 durable facts 和真正的 memory-quality 修复。

5. **记录真实变更**
   - 如果实际创建、更新、删除、合并、压缩或清理了 memory 文件，调用 `record_memory_change`。
   - `source` 只写这条 memory 的证据来源，例如用户纠正、近期对话、任务历史、提醒、已有 memory 合并，或已核实的项目证据；不要把 `source` 当成 Companion 执行路径。
   - 工具会把审计 JSONL 写到 `memory/` 外，避免未来读取记忆时吞进日志。
   - 除非输入说明是用户主动触发，否则使用 `trigger: "scheduled"`。
   - 记录要简短，并绑定到具体文件。

6. **只在真实变更后提醒**
   - 记录真实记忆变更后，用 `send_reminder` 告诉主 Companion 改了什么以及为什么重要。
   - 如果没有修改任何 memory 文件，不写 JSONL 记录，也不发送提醒。

没有值得整理的内容时，安静退出。
