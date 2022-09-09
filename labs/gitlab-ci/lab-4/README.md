# `include:file` using `ref` for branch

You can specify a `ref` for referencing code from another branch. If you do not specify a value, the `ref` defaults to the `HEAD` of the project:

Example:
Example:
```yaml
include:
  - project: 'my-group/my-project'
    ref: main
    file: '/templates/.gitlab-ci-template.yml'
```

📋 Lab: Include files from another GitLab repo
- A project with GitLab CI templates is located at `learning/gitlab-ci-templates`
- A branch `nodejs-builds` contains build scripts for `nodejs` projects inside `nodejs-ci-templates` folder
- Use the templates defined inside the `nodejs-ci-templates` folder using `include:file` directive


<details>
  <summary>Not sure?</summary>
<br>

- update the `.gitlab-ci.yml` file with below content. 
- stage, commit and push changes and see the pipeline running.
- check the `build` stage output for confirmation.

```yaml
stages:
  - build
  - test
  - deploy

include:
  - project: 'learning/gitlab-ci-templates'
    ref: nodejs-builds
    file: '/templates/.ci-template.yml'
```
<details>
  <summary>Still not working?</summary>
<br>
A bug has been left intentionally in the above block. You need to debug and fix the problem.

</details>
</details><br/>

## Tag and SHA
`ref` can also be used for Git tag and Git SHA

Example:
```yaml
  - project: 'my-group/my-project'
    ref: v1.0.0  # Git Tag
    file: '/templates/.gitlab-ci-template.yml'

  - project: 'my-group/my-project'
    ref: 787123b47f14b552955ca2786bc9542ae66fee5b  # Git SHA
    file: '/templates/.gitlab-ci-template.yml'
```