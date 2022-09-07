## Branching

Branching means you diverge from the main line of development and continue to do work without messing with that main line. The way Git branches is incredibly lightweight, making branching operations nearly instantaneous, and switching back and forth between branches generally just as fast.

For this Lab we will be using our `learning-gitlab-1` project. From the GitLab dashboard click on the project and select **learning-gitlab-1 > Repository > Branches**.

![](/imgs/branches-1.png)

> Click on **"New branch"**

![](/imgs/branches-2.png)

> In the new branch form fill:
1. **Branch Name:** as hello-world
2. **Create from:** main
3. Click "Create branch" button

![](/imgs/branches-3.png)

> We are on hello-world branch. Create a new file using WebIDE `learning-gitlab-1/hello-1.txt`

Add below content:

```
Hello, learning GitLab!
```

> 1. Add the commit message "learning gitlab branching"
> 2. Click on `Commit changes` button to save.

![](/imgs/branches-4.png)