# `include:file`

To include files from another private project on the same GitLab instance, use `include:file`. You can use `include:file` in combination with `include:project` only.

Example:
```yaml
include:
  - project: 'my-group/my-project'
    file: '/templates/.gitlab-ci-template.yml'
```

📋 Lab: Include files from another GitLab repo
- A project with GitLab CI templates is located at `learning/gitlab-ci-templates`
- Use the templates defined inside the `templates/.gitlab-ci-template.yml` folder using `include:file` directive


<details>
  <summary>Not sure?</summary>
<br>

- update the `.gitlab-ci.yml` file with below content. 
- `stage`, `commit` and `push` changes and see the pipeline running.
- check the `build` stage output for confirmation.

```yaml
stages:
  - build
  - test
  - deploy

include:
  - project: 'learning/gitlab-ci-templates'
    file: '/templates/.gitlab-ci-template.yml'

```
</details><br/>

<br/>
