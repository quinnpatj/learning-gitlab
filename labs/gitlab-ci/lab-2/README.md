# Splitting `.gitlab-ci.yml`

You can split one long `.gitlab-ci.yml` file into multiple files to increase readability, or reduce duplication of the same configuration in multiple places. Use `include` to include external YAML files in your CI/CD configuration. 

You can also store template files in a central repository and include them in projects.

The include files are:
  - Merged with those in the `.gitlab-ci.yml` file.
  - Always evaluated first and then merged with the content of the `.gitlab-ci.yml` file, regardless of the position of the `include` keyword.

The `include` subkeys:

  - `include:local`
  - `include:file`
  - `include:remote`
  - `include:template`

## `include:local`

Use `include:local` to include a file that is in the same repository as the `.gitlab-ci.yml` file. Use `include:local` instead of symbolic links.

A full path relative to the root directory (/):

  - The YAML file must have the extension `.yml` or `.yaml`.
  - You can use `* and **` wildcards in the file path.

Example:
```yaml
include:
  - local: '/templates/.gitlab-ci-template.yml'
```

You can also use shorter syntax to define the path:

```yaml
include: '/templates/.gitlab-ci-template.yml'
```

📋 Lab: Create a file `.gitlab-ci-template.yml` inside `templates` folder and add the below content:

```yaml
build-job:
  stage: build
  script:
    - echo "Hello, $GITLAB_USER_LOGIN!"
    - echo "Compiling the code..."
    - echo "Compile complete."

unit-test:
  stage: test
  script:
    - echo "Running unit tests..."
    - echo "Unit test complete..."

security-test:
  stage: test
  script:
    - echo "Running security tests..."
    - echo "Security tests complete..."

deploy-job:      # This job runs in the deploy stage.
  stage: deploy  # It only runs when *both* jobs in the test stage complete successfully.
  script:
    - echo "Deploying app from the $CI_COMMIT_BRANCH branch..."
    - echo "Application successfully deployed."

```

Update the `.gitlab-ci.yml` file with the below content and check the **pipeline** running

```yaml
stages:
  - build
  - test
  - deploy

include: '/templates/.gitlab-ci-template.yml'

```