# GitLab CI/CD

GitLab CI/CD is the part of GitLab that you use for all of the continuous methods (Continuous Integration, Delivery, and Deployment). With GitLab CI/CD, you can test, build, and publish your software with no third-party application or integration needed.

With the continuous method of software development, you continuously build, test, and deploy iterative code changes. This iterative process helps reduce the chance that you develop new code based on buggy or failed previous versions. With this method, you strive to have less human intervention or even no intervention at all, from the development of new code until its deployment.

# Runners
In GitLab, runners are agents that run your CI/CD jobs.

You already have runners available for your project, including shared runners, which are available to all projects in your GitLab instance.

To view available runners:
  - Go to **Settings > CI/CD** and expand Runners.

_Please don't create specific runners for your application. Your organization provides shared runners and those should be utilized._

# Getting started with GitLab CI
Use this document to get started with GitLab CI/CD. Before you start, you should have a project in GitLab that you would like to use CI/CD for. Let's start with a new project and build it using GitLab CI.

📋 Create a _New Project_ by importing
- Import **Sample API project** from `https://gitlab.com/gitlab-codecamp/nodejs-sample-api.git` and name it as **nodejs-sample-api**.
- Create this new project under the subgroup (_named as your user id_) you created earlier.
- The project URL should look like `https://git.nmlv.nml.com/learning/<YOUR-USER-ID>/nodejs-sample-api`

<details>
  <summary>Not sure?</summary>
<br>

> Follow the instructions defined in the [Import Project](../import-project/README.md). Use the [Sample API Project](https://gitlab.com/gitlab-codecamp/nodejs-sample-api.git) as the `Git repository URL` for importing.

</details><br/>

<br/>


📋 Clone the project locally and create a `.gitlab-ci.yml` (pay attention to the starting `dot` in filename) file at the root of your repository. This file is where you configure specific instructions for GitLab CI/CD jobs.

> Open project in visual studio code and create the file inside it (recommended)

<details>
  <summary>Not sure?</summary>

  ```script
  git clone git@git.nmlv.nml.com:learning/<USER-ID>/nodejs-sample-api.git
  ```
</details><br>

In this file, you define:
  - The structure and order of jobs that the runner should execute.
  - The decisions the runner should make when specific conditions are encountered.

- add the following content to the `.gitlab-ci.yml` file and define a CI pipeline
```yaml
stages:
  - build
  - test
  - deploy

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

`$GITLAB_USER_LOGIN` and `$CI_COMMIT_BRANCH` are [predefined variables](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) that populate when the job runs.

>Each job contains `scripts` and `stages`:
>  - `stage` describes the sequential execution of jobs. Jobs in a single stage run in parallel as long as there are available runners.
>  - Use [Directed Acyclic Graphs (DAG)](https://docs.gitlab.com/ee/ci/directed_acyclic_graph/index.html) keywords to run jobs out of stage order.

- Stage the `.gitlab-ci.yml` file and commit the changes
- Push the changes to the remote server

<details>
  <summary>Not sure?</summary>

  ```shell
  git add .gitlab-ci.yml
  git commit -m "adding CI configuration"
  git push origin main
  ```
</details><br>

### View the status of your pipeline and jobs
When you push your changes, a pipeline started.

To view your pipeline:
  - Go to **CI/CD > Pipelines**.

  A pipeline with three stages should be displayed:
  ![](/imgs/three_stages_v15_4.png)

  - To view a visual representation of your pipeline, select the pipeline ID.
  ![](/imgs/pipeline-graph-15_4.png)

  - To view details of a job, select the job name, for example, deploy-job.
  ![](/imgs/job-details_15_4.png)
<br>

# Pipeline Editor
After you create your first `.gitlab-ci.yml` file, you can use the [pipeline editor](https://docs.gitlab.com/ee/ci/pipeline_editor/index.html) for all future edits to the file. With the pipeline editor, you can:

  - Edit the pipeline configuration with automatic syntax highlighting and validation.
  - View the CI/CD configuration visualization, a graphical representation of your `.gitlab-ci.yml` file.