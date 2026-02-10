#!/bin/bash

claude --permission-mode acceptEdits "@PRD.json @progress.txt \
1. Read PRD.json and progress.txt. \
2. Find the next incomplete task (status: 'pending' with satisfied dependencies). \
3. Implement it completely. \
4. Update the feature status to 'passes' in PRD.json. \
5. Commit your changes. \
6. Append to progress.txt with what you did. \
ONLY DO ONE TASK AT A TIME."
