#!/bin/bash

# A minimal script to branch, commit, merge locally, and push to remote.
# Assumes you have uncommitted changes on the main branch.

# echo "Enter the new branch name:"
# read -r BRANCH_NAME

# git checkout -b "$BRANCH_NAME"
git add .

echo "Enter your commit message:"
read -r COMMIT_MESSAGE

git commit -m "$COMMIT_MESSAGE"
# git checkout main
# git merge "$BRANCH_NAME"

# Added command to push the updated main branch to the remote named 'origin'
git push origin main

echo "Workflow complete. Changes have been merged and pushed to the remote main branch."
