# Contributing

This project welcomes contributions and suggestions. Most contributions require you to
agree to a Contributor License Agreement (CLA) declaring that you have the right to,
and actually do, grant us the rights to use your contribution. For details, visit
<https://cla.microsoft.com>.

When you submit a pull request, a CLA-bot will automatically determine whether you need
to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the
instructions provided by the bot. You will only need to do this once across all repositories using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Table of Contents

[Dev Environment](#dev-environment)
[Pull requests](#pull-requests)

## Dev Environment

-   Install [Visual Studio Code](https://code.visualstudio.com/).

-   Install the [recommended plugins](#recommended-vs-code-extensions) for [Visual Studio Code](https://code.visualstudio.com/).

-   Install [Node.js](https://nodejs.org/en/), with [nvm](https://github.com/nvm-sh/nvm). Please use Node version 16 and npm v 8.

-   Install [jscodeshift](https://github.com/facebook/jscodeshift) globally.

-   **Internal collaborators:** Please send Aubrey Quinn your email address. After getting `Write` access, you can create branches and directly submit pull requests against this repo. Make and submit changes following the [pull request submission workflow](#pull-requests)
-   **External collaborators:** [Fork the repo and clone your fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo)

-   Install the dependencies

    ```sh
    npm install
    ```

-   Add the upstream source for being able to sync main project changes back into your fork.

    ```sh
    git remote add upstream git@github.com:microsoft/fluentui-eslint-plugin-jsx-a11y.git
    ```

-   Run the tests

    ```sh
    npm test
    ```

-   Make and submit changes following the [pull request submission workflow](#pull-requests)

##  Recommended VS Code Extensions

To ensure a consistent and productive development environment, install the following extensions in Visual Studio Code:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) — Linting for JavaScript/TypeScript.
- [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) — Run or debug Jest tests from context menu.
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) — Code formatting using Prettier.
- [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint) — Format code with Prettier and ESLint integration.
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) — Linting and style checks for Markdown files.

## To create a new ESLint rule

If you want to create a new ESLint rule:

1. Please run the [create-rule](./scripts/create-rule.md) script.

## Pull requests

First, create a new branch

```sh
git checkout -b users/<username or alias>/bug1234
```

Post change, ensure to run the build command to generate the respective output file in the dist folder:

```sh
npm run build
```

Commit the changes to your branch, including a descriptive commit message.

```sh
git commit -m 'message describing the changes'
```

Before sending the pull request, make sure your code is running on the latest code from the main repo by rebasing onto the upstream source.

```sh
git fetch upstream
git rebase upstream/main
#or
git fetch upstream
git merge upstream/main
```

Verify your changes

```sh
npm test
npm run lint
```

Push your changes

```sh
git push origin users/<username or alias>/bug1234
```

Send the [pull request](https://docs.github.com/en/pull-requests), make the requested code review changes, and get merged. 2 reviewers must approve.
