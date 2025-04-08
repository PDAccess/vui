### PDAccess - vui

This is based Vue js management console for PDAccess system
more info : https://www.pdaccess.com


### Installation

We will use [git](https://git-scm.com) to pull pdavui.

To start using Git from your computer, you must enter your credentials to identify yourself as the author of your work. The username and email address should match the ones you use in GitLab.

1-) In your shell, add your user name:

```bash
git config --global user.name "your_username"
```

2-)Add your email address:

```bash
git config --global user.email "your_email_address@example.com"
```

3-) To check the configuration, run:

```bash
git config --global --list
```

After installing and setting git we need to clone pdavui from gitlab.

1-) Go to pdavui landing page and select Clone. Copy the URL for Clone with HTTPS.
2-) Open a terminal and go to the directory where you want to clone the files.
3-) Run the following command. Git automatically creates a folder with the repository name and downloads the files there.

```bash
git clone https://git.pdaccess.com/pda/pdavui.git
```

You can use SSH version of this code too.

```bash
git clone git@git.pdaccess.com:pda/pdavui.git
```

[Further docs for git for gitlab](https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html)

### Starting pdavui

To start pdavui we need [node.js](https://nodejs.org/en/) and [vue cli](https://cli.vuejs.org). After installing these two components open terminal at project location and install dependencies run project with node.js.
```bash
npm install
```
```bash
npm run serve
```

This is going to run project at http://localhost:8080.

### Possible problems and solutions

Problem: npm does not have needed cli package or script  
Solution: Check terminal to learn which package or script is missing and use this command to install package to your computer.

```bash
npm install 'missing-package-name'
```

Problem: Can't deploy on http://localhost:8080
Solution: Change proxy and target settings at vue.config.js.


### Openapi Generator

Please run this command to update openapi descriptors.
Note: Don't forget to upgrade openapi yaml files before run this command

```shell
make generate
```

### run on local
run local using docker containers

```shell
make local
```
