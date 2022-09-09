# Generators

Generators provides a skeleton for projects following the company standards. The generators also provide you a suggested order for a pipeline along with the pre-defined standard include files developed by NM. You don't need to create your build scripts and all that is available using the include files:

Here is a suggested order for a pipeline that is deploying a micro-service to the Hub Kubernetes cluster:

```yaml
stages:
  - Pre-Build
  - Build
  - Quality
  - Deploy Int
  - Post-build
  - Deploy Non-Prod
  - CM Create
  - CM Check #this is REQUIRED for teams using normal changes
  - Deploy Production
  - CM Close - Review
```

More information on the include files is available in the [confluence](https://confluence.nml.com/display/DD/Gitlab+Include+User+Guide)

# Installing generators

Most of the generators are available in the [Engineering group](https://git.nmlv.nml.com/engineering) with the exception of [Spring Boot generator](https://git.nmlv.nml.com/java-paved-road/generator-nm-microservice-springboot)



Before installing generators you need to install `nodejs` and `Yeoman`. The generators are developed in `nodejs` and distributed using `Yeoman`.

1. Download and install [nodejs/download](https://nodejs.org/en/download)
2. Install Yeoman globally or inside a folder
    ```
    npm install -g yo
    ```

3. NodeJS local setup: update the registry to NM specific artifactory URL:
  - Follow steps defined in [NodeJS Local Setup](https://confluence.nml.com/display/DD/NodeJS+Local+Setup) document in confluence. You will need to create an Artifactory API Key and configure the artifactory URL.

4. Install the generator, we will be installing the [nodejs micro-service generator](https://git.nmlv.nml.com/engineering/generator-node-ms) for this example:
  - Start with finding the latest version of the generator-node-ms release from [Release page](https://git.nmlv.nml.com/engineering/generator-node-ms/-/releases)
  - Follow the steps below:

  ```shell
  npm install -g generator-node-ms@3.8.7 # at the time of writing this document the latest version was 3.8.7
  mkdir <your-repo-name> #name your project as sample-node-ms-<YOUR-USER-ID>
  cd <your-repo-name>
  yo node-ms # you will be presented with a set of questions in the interactive prompt
  ```
  A sample has been presented here, make sure you name your project as above:

  ![](/imgs/nodems-generator-ques.png)

  - Once the project skeleton is created, the generator will provide you a set of git commands to push your code to the GitLab's instance.
  - You have to create the project in GitLab with the same endpoint defined while creating the project. Make sure you create the project under your subgroup

  ![](/imgs/create-blank-project.png)

  ![](/imgs/blank-repo-created.png)

- Push the code and see the Pipeline running for the project

![](/imgs/nodems-pipeline.png)

We will cover only the CI part of the pipeline.