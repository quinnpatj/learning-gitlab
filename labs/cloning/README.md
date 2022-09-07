## Cloning

For this lab we will be needing the git cli. If the cli is not available on your machine please follow the [setup document](/setup/README.md) to install the cli.

Git cloning is a powerful feature and provides a more convenient way to edit files inside your repository. You can clone the repository to your local machine and make changes to several files quickly.
The cli also enables you to use more advance functions of git, the GitLab UI only provides basic functionality. Using GitLab WebIDE you can make smaller changes but offline development is faster and that can be done using cloning the repository.

Cloning creates a local copy of the remote repository. Repositories are connected using the remote connection.

## Cloning a gitlab project

Visit the blank project page we created `https://git.nmlv.nml.com/gitlab/learning/<YOUR-USER-ID>/learning-gitlab-1` and follow the steps defined in the page instructions.

```shell
git clone git@git.nmlv.nml.com:learning/<USER-ID>/learning-gitlab-1.git
```

![](/imgs/git-clone-1.png)

You will receive a fatal error if you don't have the SSH key pair configured with your GitLab account.

## Configure SSH access
There is a better and secured way to pull/push your changes to/from GitLab and that is using SSH. This will enable us to send our changes to server without using the userid and password everytime.

If you do not have an existing SSH key pair, generate a new one:

1. Open a terminal.
2. Run `ssh-keygen -t` followed by the key type and an optional comment. This comment is included in the `.pub` file that’s created. You may want to use an email address for the comment.

  For example, for ED25519:

  ```shell
  ssh-keygen -t ed25519 -C "<comment>"
  ```

3. Press `Enter`. Output similar to the following is displayed:
  ```shell
  Generating public/private ed25519 key pair.
  Enter file in which to save the key (/home/user/.ssh/id_ed25519)
  ```
4. Accept the suggested filename and directory.

5. Passphrase (empty):
  ```shell
  Enter passphrase (empty for no passphrase):
  Enter same passphrase again:
  ```
A confirmation is displayed, including information about where your files are stored.

****************************************
<br>

> A public and private key are generated. Add the public SSH key to your GitLab account and keep the private key secure. 
> Follow the below screens to add the SSH public key in GitLab

<br>

![](/imgs/ssh-1.png)

![](/imgs/ssh-2.png)

****************************************

Once the key is added, try cloning the repository again. If configured correctly, it should be successful.

```shell
git clone git@git.nmlv.nml.com:learning/<USER-ID>/learning-gitlab-1.git
```
![](/imgs/git-clone-2.png)

Let's add a README file to the repository and push the changes to GitLab:

```shell
cd learning-gitlab-1
git switch -c main
touch README.md
git add README.md
git commit -m "add README"
git push -u origin main
```

## Showing your remotes
To see which remote servers you have configured, you can run the `git remote` command. It lists the shortnames of each remote handle you've specified. If you've cloned your repository, you should at least see `origin` - that is the default name Git gives to the server you cloned from.

```
git remote -v
```

## Git pull and Git push
`git pull` and `git push` are two commands to pull and push the code from/to remote repository. You will be seeing them in action in the upcoming examples. `git status` will remain our friend even for verifying that we have a clean working directory and that our LOCAL branch is up to date with the REMOTE Branch.

When you have your project at a point that you want to share, you have to push it upstream. The command for this is simple: `git push <remote> <branch>`. If you want to push your master branch to your origin server (again, cloning generally sets up both of those names for you automatically), then you can run this to push any commits you've done back up to the server:

```shell
git status
# check the branch-name from the output
git push origin <branch-name>
```

This command works only if you cloned from a server to which you have write access and if nobody has pushed in the meantime. If you and someone else clone at the same time and they push upstream and then you push upstream, your push will rightly be rejected. You'll have to fetch their work first and incorporate it into yours before you'll be allowed to push.

## Lab 1

📋 Let's create a new file in the local cloned project and push the changes to gitlab

1. Go inside the cloned folder, for me it is `~/projects/learning-gitlab-1`
    ```
    cd ~/projects/learning-gitlab-1
    ```
2. Create a new empty file using the touch command
    ```
    touch hello.txt
    ```
3. Stage the file to the staging area.
    ```
    git add hello.txt
    ```
4. Make a commit
    ```
    git commit -m "added hello.txt"
    ```
5. Push to the remote server
    ```shell
    git push -u origin master
    ```

## Lab 2

📋 Create a new file `movies.md` with the below content and push the changes to remote server.

```
Gone with the wind
One Flew Over The Cuckoo's Nest
The Shining
```

<details>
  <summary>Not sure how?</summary>

```
echo $'Gone with the wind\nOne Flew Over The Cuckoo\'s Nest\nThe Shining\n' > movies.md
git add movies.md
git commit -m "added some movies"
git push origin master
```


</details>
<br>
