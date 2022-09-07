# Verified Commits

Git is cryptographically secure, but it's not foolproof. If you're taking work from others on the internet and want to verify that commits are actually from a trusted source, Git has a few ways to sign and verify work using GPG.

## GPG
If you want to sign anything you need to get GPG configured and your personal key installed.

```shell
$ gpg --list-keys
/Users/johndoe/.gnupg/pubring.gpg
---------------------------------
pub   2048R/0A42826A 2018-06-04
uid                  John Doe (Git signing key) <john.doe@gmail.com>
sub   2048R/874229A9 2018-06-04
```

If you don't have a key installed, you can generate one with `gpg --full-generate-key`.

```shell
$ gpg --full-generate-key
```
The command will open an interactive console asking few question:
- use the default for kind of key i.e. `(1) RSA and RSA (default)`
- recommended keysize is 4096. It might take long to create a 4096 bit key depending on your CPU
- set the expiry to `1y`
- enter your name and email address. Use the email address associated with the gitlab account
- enter a strong passphrase, then enter it again to confirm it.
- finally confirm by pressing Okay `(o)`

![](/imgs/gpg-generate.png)

## List GPG key
To list your private GPG key, run this command, replacing <EMAIL> with the email address you used when you generated the key:

```shell
gpg --list-secret-keys --keyid-format LONG <EMAIL>
```

## Creating a git repo and sign commits using the generated keypair

```shell
$ mkdir verified-commits
$ cd verified-commits
$ git init
$ touch file1
$ git add -A
# regular commit
$ git commit -m "file one commit"
# now checking in the log
$ git log
```

> Making second commit, this one as signed

```shell
$ touch file2
$ git add -A
# signed commit -S
$ git commit -S -m "file two commit, signed"
$ git log
# display information on signature
$ git log --show-signature
```

![](/imgs/git-log-show-signature.png)

> Making a fake commit with some other user's name and email

```shell
$ touch file3
$ git add -A
$ git commit --author "John Doe <johndoe@gmail.com>" -m "fake commit"
$ git log
```

> Making a fake commit with some other user's name and email and signing the commit

```shell
$ touch file3
$ git add -A
$ git commit -S --author "John Doe <johndoe@gmail.com>" -m "fake commit"
# verify how it looks in the logs
$ git log --show-signature
```

# Add a GPG key to your GitLab account

Export the GPG public key and store it in the clipboard. Run this command, replacing <EMAIL> with the email address you used when you generated the key:

```shell
$ gpg --export --armor <EMAIL> | clip.exe
```

To add a GPG key to your user settings:

![](/imgs/add-gpg-keys.png)

  1. Sign in to GitLab.
  2. In the top-right corner, select your avatar.
  3. Select **Edit profile.**
  4. On the left sidebar, select **GPG Keys.**
  5. In **Key**, paste your _public_ key.
  6. To add the key to your account, select **Add key**. GitLab shows the key’s fingerprint, email address, and creation date:

![](/imgs/added-gpg-key-to-profile.png)


## Associate your GPG key with Git 
After you create your GPG key and add it to your account, you must configure Git to use this key to avoid using `git commit -S` option every time:

1. Run this command to list the private GPG key you just created, replacing <EMAIL> with the email address for your key:

```shell
gpg --list-secret-keys --keyid-format LONG <EMAIL>
```

```shell
# adding configuration on the local config i.e. ".git/config"
git config user.signingkey <EMAIL>
git config commit.gpgSign true
```

## Lab:

📋 Create a new project in GitLab and name it as `verified-commits`. Push your changes and check the commit history. It should look like the below image:

![](/imgs/verified-commit-history.png)

# Revoke a GPG key

If a GPG key becomes compromised, revoke it. Revoking a key changes both future and past commits:

  - Past commits signed by this key are marked as unverified.
  - Future commits signed by this key are marked as unverified.

To revoke a GPG key:

  1. In the top-right corner, select your avatar.
  2. Select Edit profile.
  3. On the left sidebar, select GPG Keys ().
  4. Select Revoke next to the GPG key you want to delete.

# Remove a GPG key

When you remove a GPG key from your GitLab account:

  - Previous commits signed with this key remain verified.
  - Future commits (including any commits created but not yet pushed) that attempt to use this key are unverified.

To remove a GPG key from your account:

  1. In the top-right corner, select your avatar.
  2. Select Edit profile.
  3. On the left sidebar, select GPG Keys ().
  4. Select Remove () next to the GPG key you want to delete.

If you must unverify both future and past commits, revoke the associated GPG key instead.
