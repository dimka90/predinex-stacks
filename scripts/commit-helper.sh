#!/bin/bash

# Predinex Commit Helper
# Usage: ./scripts/commit-helper.sh "your commit message"

MESSAGE=$1

if [ -z "$MESSAGE" ]; then
    echo "❌ Error: Please provide a commit message."
    echo "Usage: ./scripts/commit-helper.sh \"your commit message\""
    exit 1
fi

# Add all changes
git add .

# Commit with message
git commit -m "$MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Successfully committed: $MESSAGE"
else
    echo "❌ Commit failed."
fi
