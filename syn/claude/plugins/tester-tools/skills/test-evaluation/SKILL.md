# Test Evaluation Skill

Use this skill when designing and evaluating tests for a draft agent. The goal is to assess whether the agent delivers its intended purpose — judge outcomes, not execution paths.

## Step 1: Derive Expected Outcomes from Requirements

Before designing any test cases, read the requirements carefully and define what "success" looks like for this agent. This becomes your rubric — you are the human-verified standard.

For each test you will design, write down:
- **Input**: what you will send to the agent
- **Expected outcome**: what a correct, useful response looks like for this input

Example for a fairy tale agent:
- Input: "Write a story about a brave rabbit"
- Expected outcome: A complete story featuring a rabbit as the protagonist, age-appropriate language, coherent narrative arc, ends with a moral lesson

This expected outcome definition is what you judge against — not abstract quality, not your general impression.

## Step 2: Design Test Cases

Design **2–3 test cases** that cover the core value the agent is supposed to deliver. Use realistic user requests — what would a real user actually send?

Vary by:
- **Task complexity** — simple request vs. multi-step task
- **Phrasing** — direct vs. vague
- **Context** — with vs. without background information

Do NOT design tests to trick the agent or find edge cases. You are evaluating effectiveness.

## Step 3: Evaluate Each Response

After receiving the agent's response, evaluate it against the pre-defined expected outcome across 4 independent dimensions:

### Dimension 1: Task Completion
Did the agent produce the expected outcome?
- **Pass**: Output matches the expected outcome, result is usable
- **Partial**: Partially matches — something was done but key parts are missing
- **Fail**: Output does not match the expected outcome, task was not completed

### Dimension 2: Instruction Following
Did the agent respect the constraints and requirements of its purpose?
- **Pass**: Followed all relevant constraints (format, style, length, domain rules)
- **Partial**: Mostly followed but missed specific requirements
- **Fail**: Ignored constraints or violated the agent's defined behavior

### Dimension 3: Output Quality
Is the output accurate and genuinely useful for a real user in this domain?
- **Pass**: A real user would find this valuable and correct
- **Partial**: Acceptable but noticeably lacking in depth, accuracy, or relevance
- **Fail**: Unhelpful, inaccurate, or not appropriate for the domain

### Dimension 4: Unexpected Behavior
Did anything unexpected happen?
- **None**: Normal execution
- **Minor**: Slightly off-tone, unnecessary caveats, minor irrelevance
- **Major**: Hallucination, ignored input entirely, crashed, dangerous output

## Step 4: Per-Test Verdict

Combine the 4 dimensions into a single verdict:
- ✅ **Pass** — Task Completion Pass, no Major unexpected behavior
- ⚠️ **Partial** — Task completed but with gaps, or instruction issues
- ❌ **Fail** — Task not completed, or Major unexpected behavior

## Step 5: Overall Verdict

After all tests:
- ✅ **Ready** — Core functionality works, agent delivers its purpose
- ⚠️ **Needs Work** — Works but has specific, fixable issues
- ❌ **Major Issues** — Core functionality broken, fundamental problems

## Writing the Report

For every Partial or Fail result:
- Quote the actual response (excerpt is fine)
- State exactly what was missing or wrong compared to the expected outcome
- Give a concrete recommendation for the creator

The report is only useful if Embla knows exactly what to fix.
