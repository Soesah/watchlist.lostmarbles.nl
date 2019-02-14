#!/bin/bash -e

indent='     ';
deploy=$1
version=$(cd bin && ts-node versioning.ts get && cd ..)
updated=$(cd bin && ts-node versioning.ts preview:${deploy} && cd ..)

# 0. quit when there are still changes
if ! git diff-index --quiet HEAD --; then
    echo -e "\n${indent}\033[33mCannot deploy, there are unsaved changes\033[0m\n"
    exit 1
fi


# 1. switch to master
echo -e '\n\033[90m  I. \033[31mSwitching to master\033[0m'
co=$(git checkout master -q)
branch_name=$(git symbolic-ref -q HEAD)
branch_name=${branch_name##refs/heads/}
branch_name=${branch_name:-HEAD}

if ! [ "${branch_name}" == "master" ] ; then
    echo -e "\n${indent}\033[33mFailed to switch to branch 'master', found '${branch_name}'\033[0m\n"
    exit 1
else
  echo "${indent}Switched to branch 'master'"
fi


# 2. rebase and create a version commit
echo -e '\n\033[90m II. \033[31mUpdating with develop\033[0m'

co=$(git rebase develop)
echo "${indent}Rebased 'master' on branch 'develop'"


# 3. update version
echo -e '\n\033[90mIII. \033[31mUpdating version\033[0m'

echo "${indent}Current version is ${version}"
echo "${indent}Updating to new ${deploy} version ${updated}"

cd bin
newversion=$(ts-node versioning.ts ${deploy})
cd ..
git add src/version.json
commit=$(git commit -m "Release ${updated}")


# 4. git tag
echo -e "\n\033[90m IV. \033[31mCreating a tag for release ${updated}\033[0m"
git tag ${updated}
echo "${indent}Tagged 'master' as ${updated}"
co=$(git push --tags -q)
co=$(git push -q)
echo "${indent}Pushed branch 'master' to 'origin/master'"

# 5. run `yarn deploy`
echo -e '\n\033[90m  V. \033[31mDeploying\033[0m'
yarn deploy


# 6. switch back to develop
echo -e '\n\033[90m VI. \033[31mSwitching back to develop\033[0m'
co=$(git checkout develop -q)
echo "${indent}Switched to branch 'develop'"

# 6. update develop
echo -e '\n\033[90m VI. \033[31mFinished, updating develop\033[0m'
co=$(git rebase master)
echo "${indent}Rebased 'develop' on branch 'master'"
co=$(git push -q)
echo "${indent}Pushed branch 'develop' to 'origin/develop'"

echo -e '\n'
