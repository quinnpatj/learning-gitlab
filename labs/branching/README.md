## Branching

Branching means you diverge from the main line of development and continue to do work without messing with that main line. The way Git branches is incredibly lightweight, making branching operations nearly instantaneous, and switching back and forth between branches generally just as fast.

For this Lab we will be using our learning-gitlab-1 project. From the GitLab dashboard click on the project and select **learning-gitlab-1 > Repository > Branches**.

![](/imgs/branches-1.png)

> Click on "New branch"

![](/imgs/branches-2.png)

> In the new branch form fill:
1. **Branch Name:** as hello-world
2. **Create from:** master
3. Click "Create branch" button

![](/imgs/branches-3.png)

> We are on hello-world branch. Make changes using WebIDE in file `my-spring-project/src/main/java/com/example/demo/DemoApplication.java`

Change the below line
```
return "Spring is here!";
```

to 

```
return "Hello, learning gitlab!";
```

> 1. To save, click on the `Create commit...` button on the left panel. 
> 2. Add the commit message "learning gitlab branching"
> 3. Commit to the hello-world branch
> 4. Uncheck `Start a new merge request` checkbox.
> 4. Click on `Commit` button.




