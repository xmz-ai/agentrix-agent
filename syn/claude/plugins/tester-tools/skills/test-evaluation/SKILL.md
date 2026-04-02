# Test Evaluation Skill

Use this skill when designing test cases for an AI agent and evaluating its responses. The goal is to assess whether the agent actually works well for its intended purpose — not to find code bugs or boundary conditions.

## Designing Test Cases

Test cases should be **realistic user requests** that someone would genuinely send to the agent. Ask yourself: what would a real user want from this agent?

Design 2–3 scenarios that cover the core value the agent is supposed to deliver. For example:

- A writing assistant → test with actual writing tasks users would ask for
- A code reviewer → test with real code snippets that need review
- A customer support agent → test with typical support questions

Vary the scenarios by:
- **Task complexity** — simple request vs. multi-step task
- **Phrasing** — direct question vs. vague request
- **Context** — with vs. without background information

Do NOT write test cases designed to "trick" the agent or find edge cases. You are evaluating effectiveness, not robustness.

## Evaluation Criteria

After receiving the agent's response, evaluate it on 3 dimensions:

### 1. Task Completion
Did the agent actually do what was asked?
- **Pass**: Fully completed the task, result is usable
- **Partial**: Partially completed, or completed it but with notable gaps
- **Fail**: Did not complete the task, gave a generic non-answer, or misunderstood

### 2. Output Quality
Is the output genuinely good and useful?
- **Pass**: High quality — a user would be satisfied with this
- **Partial**: Acceptable but could be significantly better
- **Fail**: Poor quality — unhelpful, vague, or incorrect

### 3. Agent Behavior
Did the agent behave appropriately for its role?
- **Pass**: Stayed focused, used tools correctly, communicated well
- **Partial**: Minor behavioral issues — slightly off-topic, verbose, awkward
- **Fail**: Wrong behavior — ignored its purpose, failed to use tools it needed

## Overall Verdict

| Criteria result | Overall verdict |
|-----------------|-----------------|
| All pass | ✅ Pass |
| 1 partial, rest pass | ✅ Pass |
| 2 partial | ⚠️ Partial |
| Any fail | ❌ Fail |

## Scoring

After all tests, assign an overall score out of 10 based on what a real user would think:
- **9–10**: Excellent — does its job really well, users would be delighted
- **7–8**: Good — works well, minor improvements would help
- **5–6**: Fair — core function works but output quality needs work
- **3–4**: Poor — frequently misses the mark, needs significant improvement
- **1–2**: Broken — doesn't deliver on its purpose at all

## Writing the Evaluation

Be specific. Quote the actual response (first 100–150 chars is enough). Say what worked and what didn't. A partial verdict should explain both the good and the gap. The goal is actionable feedback for the agent's creator.
