### Local development

```bash
git clone git@github.com:conwnet/github1s.git
cd github1s
yarn
yarn watch
# The cli will automatically open http://localhost:5000 once the build is completed.
# You can visit http://localhost:5000/conwnet/github1s if it doesn't.
```

#### Local development with full VS Code build

You need [these prerequisites (the same ones as for VS Code)](https://github.com/microsoft/vscode/wiki/How-to-Contribute#prerequisites) for development with full VS Code build.
Please make sure you could build VS Code locally before the watch mode.

To verify the build:

```bash
cd github1s
yarn build:vscode
```

After the initial successful build, you could use the watch mode:

```bash
cd github1s
yarn
yarn watch-with-vscode
# The cli will automatically open http://localhost:5000 once the build is completed.
# You can visit http://localhost:5000/conwnet/github1s if it doesn't.
```

### ... or ... VS Code + Docker Development

You can use the VS Code plugin [Remote-Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) `Dev Container` to use a Docker container as a development environment.

1. Install the Remote-Containers plugin in VS Code & Docker
2. Open the Command Palette (default shortcut `Ctrl+Shift+P`) and choose `Remote-Containers: Clone Repository in Container Volume...`
3. Enter the repo, in this case `https://github.com/conwnet/github1s.git` or your forked repo
4. Pick either, `Create a unique volume` or `Create a new volume`

   - Now VS Code will create the docker container and connect to the new container so you can use this as a fully setup environment!

5. Open a new VS Code Terminal, then you can run the `yarn` commands listed above.

```bash
yarn
yarn watch
# The cli will automatically open http://localhost:5000 once the build is completed.
# You can visit http://localhost:5000/conwnet/github1s if it doesn't.
```

### Format all codes

```bash
yarn format
```

It uses `prettier` to format all possible codes.

## Build

```bash
yarn
yarn build
```
