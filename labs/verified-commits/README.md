# Verified Commits

Git is cryptographically secure, but it's not foolproof. If you're taking work from others on the internet and want to verify that commits are actually from a trusted source, Git has a few ways to sign and verify work using GPG.

## GPG
If you want to sign anything you need to get GPG configured and your personal key installed.

```text
$ gpg --list-keys
/Users/johndoe/.gnupg/pubring.gpg
---------------------------------
pub   2048R/0A42826A 2018-06-04
uid                  John Doe (Git signing key) <john.doe@gmail.com>
sub   2048R/874229A9 2018-06-04
```
