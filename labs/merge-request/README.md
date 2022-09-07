## Merge Request

There are many different ways to create a merge request. 

> Merge requests are designed around a one-to-one (1:1) branch relationship. Only one open merge request may be associated with a given target branch at a time.

For this Lab we will be using our `learning-gitlab-1` project. From the GitLab dashboard click on the project and select **learning-gitlab-1 > Repository > Branches**.

![](/imgs/branches-1.png)

> Click on "Merge Request" in front of hello-world branch

![](/imgs/merge-request-1.png)

> In the "New merge request" form fill:
1. **Title:** this is auto filled, you can add more relevant information for the reviewer
2. **Description:** More detailed explaination of the changes for the reviewer
3. **Assignee:** Who is creating this merge request, for now select your username.
4. **Reviewer:** Who is going to review this merge request, for now select instructor name.
5. Click "Create merge request" button
6. A new merge request will be created. Merge the changes to the master branch.

![](/imgs/merge-request-2.png)

## Lab

📋 Create a new branch and create a new file with some dummy text inside `learning-gitlab-1/hello-2.txt` file and then create a merge request which is in `Draft` mode. Try merging the request and see what happens.
