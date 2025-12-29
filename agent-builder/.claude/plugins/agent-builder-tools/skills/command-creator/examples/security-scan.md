## Overview

Perform a security scan of the codebase using available security detection skills.

## Steps

1. **Identify Target Files**
   - Scan project for source files: `.js`, `.ts`, `.py`, `.java`, `.php`
   - Exclude: `node_modules/`, `vendor/`, `dist/`, `build/`
   - List files to analyze

2. **Apply Security Skills**
   Use detection patterns from:
   - SQL injection detection skill
   - XSS detection skill
   - Authentication bypass detection skill

   For each skill, apply its analysis steps to relevant files.

3. **Categorize Findings**
   Group issues by:
   - **Severity**: Critical, High, Medium, Low
   - **Type**: Injection, XSS, Auth, Config, etc.
   - **File**: Group by source file

4. **Generate Summary**
   Create summary showing:
   - Total issues by severity
   - Most affected files
   - Top vulnerability types

5. **Offer Report Generation**
   Ask user: "Would you like a detailed report? Run /security-report"

## Error Handling

If no source files found:
- Inform user: "No source files found in project"
- Suggest: Check current directory or specify file patterns

If skills not available:
- Proceed with basic pattern matching
- Note: "Full analysis requires security detection skills"

## Output Format

Display findings as:

### Security Scan Results

**Summary:**
- Critical: X issues
- High: X issues
- Medium: X issues
- Low: X issues

**Critical Findings:**
1. [File:Line] - [Issue type] - [Brief description]
2. ...

**Next Steps:**
- Run `/security-report` for detailed report
- Address critical issues first
