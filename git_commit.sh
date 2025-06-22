#!/bin/bash

# Prompt for commit message
read -p "Enter commit message: " commit_msg

if [ -z "$commit_msg" ]; then
  echo "Commit message cannot be empty."
  exit 1
fi

# Stage all changes (tracked and untracked)
git add --all

# Commit with the message
git commit -m "$commit_msg"

# Push to the current branch on origin
git push
