# 记忆整理

_这是一次聚焦的 Companion 记忆维护。只有在确实能提升记忆语料质量时才修改。_

## 范围

只审查当前 Companion agent home 里的记忆：

- `MEMORY.md`
- `memory/{topic}/memory.md`
- `memory/{topic}/YYYY-MM-DD-slug.md`

不要读取 `memory-changes/` 这类记忆变更审计日志；它们只是 bookkeeping，不是记忆输入。

你的目标是维护 Companion 记忆质量，而不是生成活动流水账。

近期对话、任务历史、提醒和已有 memory entries 都可以作为证据来源，但只有在它们与某个记忆主题相关时才使用。判断目标是：现有记忆是否出现冲突、过期、重复、碎片化、过于冗长、summary 薄弱或会误导未来判断。

不要记录每个近期事件。不要保留中间任务状态，除非它改变了未来会话需要依赖的 durable fact。

仓库文件和 task workspace 不是常规扫描范围。只有某条记忆声明需要快速核对时，才读取相关 commit、issue、文件、任务结果或外部状态。

## 检查清单

1. **先建立地图**
   - 阅读 `MEMORY.md`。
   - 先读 topic summary，再打开 individual entries。
   - 只选择明显可能存在冲突、过期、重复堆积、碎片化或 summary 薄弱的 topic。

2. **识别维护需求**
   - 冲突：两条记忆不可能同时为真。
   - 过期：某条记忆里的状态或偏好已经被更新的记忆明确取代。
   - 重复堆积：多条 entry 反复表达同一件事，但没有增加有用细节。
   - 碎片化：大量小 entry 合并到 topic summary 或 consolidated entry 后会更有用。
   - summary 薄弱：`memory/{topic}/memory.md` 已经不能反映下面的 entries。

3. **保守编辑**
   - 优先更新 topic summary，不要一上来重写大量 individual entries。
   - 只有在合并后仍然清晰、可追踪时才合并重复项。
   - 只有在事实明显过期、冗余或会误导未来判断时才删除。
   - 如果仍有不确定性，把不确定性写进记忆，不要制造虚假的确定性。

4. **记录真实变更**
   - 如果实际创建、更新、删除、合并、压缩或清理了 memory 文件，调用 `record_memory_change`。
   - 这个专门任务使用 `source: "memory_organization"`。
   - 工具会把审计 JSONL 写到 `memory/` 外，避免未来读取记忆时吞进日志。
   - 除非输入说明是用户主动触发，否则使用 `trigger: "scheduled"`。
   - 记录要简短，并绑定到具体文件。

5. **只在真实变更后提醒**
   - 记录真实记忆变更后，用 `send_reminder` 告诉主 Companion 改了什么以及为什么重要。
   - 如果没有修改任何 memory 文件，不写 JSONL 记录，也不发送提醒。

没有值得整理的内容时，安静退出。
