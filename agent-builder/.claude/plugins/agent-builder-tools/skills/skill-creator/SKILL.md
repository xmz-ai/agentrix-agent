---
name: Skill Creator
description: This skill should be used when agent-builder determines that the agent needs Skills for domain knowledge, procedural guidance, creative tasks, or optional features that shouldn't pollute context. Provides skillContent format requirements, best practices, and a library of production-quality SKILL examples.
version: 0.4.0
---

# Skill Creator

## Overview

Skills are the **highest AI autonomy** component:
- AI fully decides whether and how to use
- Loaded on demand, compressible after use
- Perfect for: domain knowledge, creative tasks, optional features

## When to Use Skills

| Scenario | Example |
|----------|---------|
| Domain knowledge | Security patterns, API conventions |
| Creative tasks | Design styles, content generation |
| Optional features | Document processing for code agent |
| Best practices | Commit conventions, code review checklist |
| Many related operations (>3) | Avoid context pollution |

## When NOT to Use Skills

| Scenario | Use Instead | Reason |
|----------|-------------|--------|
| Built-in capabilities | Nothing | Read, Write, Git, Bash already exist |
| Operations needing env vars | MCP Tool | AI cannot access env vars via Skill |
| Fixed trigger timing | Hook | Zero context occupation |
| External API calls | MCP Tool | Needs actual execution |

---

## How to Write a Good SKILL

By analyzing the lib/ examples, here are the **key patterns and principles** for writing effective SKILLs:

### Pattern 1: Technical Tool (pdf, xlsx, webapp-testing)

**Best for**: Code-centric workflows with specific libraries/tools

**Structure**:
```markdown
# [Tool Name]

## Overview
[1-2 sentences]

## Quick Start
[Minimal working code example - copy-paste ready]

## [Library 1] - [Purpose]
### [Operation 1]
[Code example]

### [Operation 2]
[Code example]

## Common Tasks
[Task-specific snippets]

## Quick Reference
| Task | Tool | Code |
|------|------|------|

## Best Practices
- [Bullets]
```

**Example from pdf/SKILL.md**:
```python
## Quick Start
from pypdf import PdfReader, PdfWriter

reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

text = ""
for page in reader.pages:
    text += page.extract_text()
```

**Key characteristics**:
- ✅ Every operation has working code example
- ✅ Quick Reference table for fast lookup
- ✅ Multiple libraries compared (when to use which)
- ✅ Error handling and troubleshooting included

---

### Pattern 2: Creative Process (algorithmic-art)

**Best for**: Guiding creative/generative tasks with philosophy + process

**Structure**:
```markdown
# [Creative Domain]

## [Philosophy/Concept Phase]
[4-6 paragraphs on creative principles]

## [Implementation Phase]
### Step 0: Read the Template First
### Technical Requirements
### Craftsmanship Requirements

## Resources
- templates/: Starting point files
- references/: Detailed documentation
```

**Example from algorithmic-art/SKILL.md**:
```markdown
## ALGORITHMIC PHILOSOPHY CREATION

To begin, create an ALGORITHMIC PHILOSOPHY that will be interpreted through:
- Computational processes, emergent behavior, mathematical beauty
- Seeded randomness, noise fields, organic systems
- Particles, flows, fields, forces

The philosophy must emphasize:
- Algorithmic expression
- Emergent behavior
- Computational beauty
```

**Key characteristics**:
- ✅ Philosophy/concept BEFORE implementation
- ✅ Multi-step creative process
- ✅ Templates as starting points (never from scratch)
- ✅ Quality/craftsmanship standards explicitly stated
- ✅ Emphasis on uniqueness ("original algorithmic art")

---

### Pattern 3: Resource Hub (internal-comms, theme-factory)

**Best for**: Skills that route to multiple sub-resources

**Structure**:
```markdown
# [Skill Name]

## When to use this skill
[Trigger scenarios - bulleted list]

## How to use this skill
1. Identify the [type/variant] from request
2. Load appropriate file from [subdirectory]
3. Follow specific instructions in that file

## [Types/Variants] Available
1. **[Type 1]** - [Description]
2. **[Type 2]** - [Description]

## [Optional] Create Custom
[Instructions for custom creation]
```

**Example from internal-comms/SKILL.md**:
```markdown
## How to use this skill

1. **Identify the communication type** from the request
2. **Load the appropriate guideline file** from examples/:
   - `examples/3p-updates.md` - For Progress/Plans/Problems
   - `examples/company-newsletter.md` - For newsletters
   - `examples/faq-answers.md` - For FAQ responses
3. **Follow the specific instructions** in that file
```

**Key characteristics**:
- ✅ Main SKILL.md is lean (just navigation)
- ✅ Detailed content in subdirectories
- ✅ Clear selection criteria
- ✅ Only load what's needed (context efficient)

---

### Pattern 4: Workflow Guide (webapp-testing)

**Best for**: Teaching multi-step methodology with decision logic

**Structure**:
```markdown
# [Topic]

## Overview
[What this enables]

## Decision Tree: Choosing Your Approach
[ASCII flowchart for decision logic]

## Example: [Common Scenario]
[Complete working example]

## [Methodology Name] Pattern
1. [Step 1]
2. [Step 2]

## Best Practices
- [Bullets]
```

**Example from webapp-testing/SKILL.md**:
```markdown
## Decision Tree: Choosing Your Approach

User task → Is it static HTML?
    ├─ Yes → Read HTML file directly
    │         ├─ Success → Write Playwright script
    │         └─ Fails → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is server already running?
        ├─ No → Run: python scripts/with_server.py
        └─ Yes → Reconnaissance-then-action
```

**Key characteristics**:
- ✅ Decision trees for branching logic
- ✅ Helper scripts as black boxes (don't read source)
- ✅ Common pitfalls explicitly called out (❌ Don't / ✅ Do)
- ✅ Complete working examples

---

## Critical Principles for Effective SKILLs

### 1. Concise is Key (Context is Shared)

Claude is already smart. Only add what Claude doesn't know.

```markdown
❌ "First, let me explain what PDF files are. PDF stands for..."
✅ "## Quick Start" [Jump straight to usage]
```

**From xlsx/SKILL.md** - No explanation of what Excel is, straight to:
```python
import pandas as pd
df = pd.read_excel('file.xlsx')
```

### 2. Show, Don't Tell (Code > Description)

Every operation needs a working code example.

**From xlsx/SKILL.md**:
```python
### ❌ WRONG - Hardcoding Calculated Values
total = df['Sales'].sum()
sheet['B10'] = total  # Hardcodes 5000

### ✅ CORRECT - Using Excel Formulas
sheet['B10'] = '=SUM(B2:B9)'
```

### 3. Specificity Over Generality

```markdown
❌ "Check for issues"
✅ "Check for division by zero in formulas (#DIV/0!)"
```

**From xlsx/SKILL.md**:
```markdown
## Formula Verification Checklist
- [ ] **Test 2-3 sample references**: Verify they pull correct values
- [ ] **Column mapping**: Confirm Excel columns match (column 64 = BL, not BK)
- [ ] **Row offset**: Remember Excel rows are 1-indexed
```

### 4. Actionable Steps (Not Vague)

```markdown
❌ "Analyze the code"
✅ "1. Search for `db.query` → 2. Trace parameter source → 3. Check sanitization"
```

### 5. Progressive Disclosure (Manage Context)

Split large content into sub-files, only load when needed.

```
skill-name/
├── SKILL.md          # Core workflow (<500 lines)
├── references/       # Detailed docs (load when needed)
├── examples/         # Concrete examples
├── scripts/          # Executable code (run, don't read)
├── templates/        # Starting point files
└── assets/           # Output resources
```

**From algorithmic-art/SKILL.md**:
```markdown
## RESOURCES
- **templates/viewer.html**: REQUIRED STARTING POINT for all HTML artifacts
```

### 6. Description is the Trigger Mechanism

The `description` field determines when the SKILL activates. Be specific and comprehensive.

**Good descriptions** (from lib/):
```yaml
# pdf/SKILL.md
description: Comprehensive PDF manipulation toolkit for extracting text
  and tables, creating new PDFs, merging/splitting documents, and
  handling forms. When Claude needs to fill in a PDF form or
  programmatically process, generate, or analyze PDF documents at scale.

# algorithmic-art/SKILL.md
description: Creating algorithmic art using p5.js with seeded randomness
  and interactive parameter exploration. Use when users request creating
  art using code, generative art, algorithmic art, flow fields, or
  particle systems.

# internal-comms/SKILL.md
description: A set of resources to help write internal communications.
  Use when asked to write status reports, newsletters, FAQs, incident
  reports, project updates, etc.
```

---

## Creating Skills

### Directory Structure

**IMPORTANT**: Skills require a specific directory structure:

1. Create a **directory** named after the skill: `skills/{skill-name}/`
2. Inside that directory, create a file named exactly `SKILL.md`

```
{agent}/.claude/plugins/{plugin-name}/skills/{skill-name}/SKILL.md
```

**Example:**
```
# Correct ✅
skills/ui-design-principles/SKILL.md

# Wrong ❌
skills/ui-design-principles.md
```

**Full structure with optional subdirectories:**

```
{agent}/.claude/plugins/{plugin-name}/skills/{skill-name}/
├── SKILL.md              # Main skill file (REQUIRED, must be named SKILL.md)
├── references/           # Detailed documentation (optional)
├── examples/             # Example files (optional)
├── templates/            # Starting point files (optional)
├── scripts/              # Executable code (optional)
└── assets/               # Output resources (optional)
```

### SKILL.md Format (Required)

```yaml
---
name: Skill Display Name
description: [Comprehensive trigger description - what it does + when to use]
version: 0.1.0
---

# Skill Display Name

## Overview
[Brief overview]

## [Main Content]
[Skill-specific content]
```

---

## SKILL Library (lib/)

The `lib/` directory contains **production-quality SKILL examples** from Anthropic. Use these as:

1. **Direct copy** - Copy suitable SKILLs directly to target agent
2. **Reference** - Study patterns and adapt for custom SKILLs
3. **Learning** - Understand how to write effective SKILLs

### Library Index

| Category | SKILL | Best For | Pattern |
|----------|-------|----------|---------|
| **Documents** | `pdf/` | PDF processing (extract, merge, forms) | Technical Tool |
| | `docx/` | Word document creation/editing | Technical Tool |
| | `xlsx/` | Excel with formulas | Technical Tool |
| | `pptx/` | PowerPoint creation | Technical Tool |
| **Creative** | `algorithmic-art/` | Generative art with p5.js | Creative Process |
| | `canvas-design/` | Visual art design | Creative Process |
| | `theme-factory/` | Artifact theme styling | Resource Hub |
| | `slack-gif-creator/` | Animated GIFs for Slack | Technical Tool |
| **Development** | `webapp-testing/` | Playwright web testing | Workflow Guide |
| | `web-artifacts-builder/` | HTML/React artifacts | Technical Tool |
| | `frontend-design/` | Frontend design patterns | Technical Tool |
| **Enterprise** | `internal-comms/` | Internal communications | Resource Hub |
| | `brand-guidelines/` | Brand asset application | Resource Hub |

### Using the Library

- Preview the skill in `lib` before you copy to agent path, not only based on the skill name.
- You also can design your skill based on the skills in `lib`, or only copy the part of the skill what you need.

---

## Quality Checklist

Before finalizing a SKILL, verify:

- [ ] **Description** includes all trigger scenarios
- [ ] **Conciseness** - every paragraph justifies its token cost
- [ ] **Code examples** - at least one for each major operation
- [ ] **Progressive disclosure** - large content split to subdirectories
- [ ] **No redundancy** - information lives in ONE place
- [ ] **Pattern match** - follows one of the four patterns above
- [ ] **Tested** - code examples verified to work
