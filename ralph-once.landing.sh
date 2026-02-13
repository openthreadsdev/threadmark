#!/bin/bash
# Pre-commit hooks (F100) enforce code quality (linting, formatting, type checking).
# Ralph focuses on implementation and testing. Hooks will block commits with issues.

claude --permission-mode acceptEdits "@PRD.landing.json @progress.landing.txt \
1. Read PRD.landing.json and progress.landing.txt. \
2. Find the next incomplete task (status: 'pending' with satisfied dependencies). \
3. Implement it completely with tests. \
4. Update the feature status to 'passes' in PRD.landing.json. \
5. Commit your changes (pre-commit hooks will enforce quality automatically). \
6. Append to progress.landing.txt with what you did. \
7. EXIT IMMEDIATELY - do not process any additional tasks."
