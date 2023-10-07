#!/bin/sh

## USE THIS SCRIPT TO CREATE A NEW BRANCH AND PUSH YOUR CHANGES TO IT IN ONE SHOT
## YOU WILL NEED TO SPECIFY THE NAME OF THE BRANCH AS A FIRST ARGUMENT
## AND THE COMMIT MESSAGE AS A SECOND ARGUMENT
## EXAMPLE: ./push-new-branch.sh feature/make-things-more-awesome 'Just making this more awesome than they were yesterday'

if [ -z "$1" ]; then
    echo 'Branch name not specified, aborted operation.'
elif [ -z "$2" ]; then
    echo 'Commit message not specified, aborted operation.'
else

    branch_name="$1"
    commit_message="$2"
    
    git checkout -b $branch_name && \
    git push --set-upstream origin $branch_name && \
    
    # Build release archive if last commit
    if [ -z "$3" ]; then
        echo 'UPDATEING LOCAL NODE BINARIES' && \
        ./update-local-node.sh
    fi && \
    
    git add --all && \
    git commit -m "'$commit_message'" && \
    git push && \



    echo 'DONE'
fi