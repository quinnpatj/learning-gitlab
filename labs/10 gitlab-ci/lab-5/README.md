# Multiple files
You can include multiple files from the same project:

```yaml
include:
  - project: 'my-group/my-project'
    ref: main
    file:
      - '/templates/.builds.yml'
      - '/templates/.tests.yml'
```

📋 Include files from another GitLab repo
- Folder `multi-templates` contains multiple files for build scripts inside `learning/gitlab-ci-templates` project

Update the `.gitlab-ci.yml` file with below content and see the pipeline running and check the `build` stage output for confirmation:

```yaml
stages:
  - build
  - test
  - deploy

include:
  - project: 'learning/gitlab-ci-templates'
    ref: master
    file: 
      - '/multi-templates/build.yml'
      - '/multi-templates/test.yml'
      - '/multi-templates/deploy.yml'

```