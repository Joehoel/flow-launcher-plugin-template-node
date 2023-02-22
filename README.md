# Flow Launcher Plugin Template for Node

This repository contains a template for creating a [Flow Launcher](https://www.flowlauncher.com/) plugin using the [Node.js](https://nodejs.org/en/) runtime.

## Development

To be able to test this easily, you need to create a symlink between this directory and the plugin directory from Flow Launcher. This can be done by searching `Flow Launcher UserData Folder` in the launcher and pressing enter. The plugins are found in the `Plugins` folder.

You can create a symlink by opening command prompt (CMD) in Windows and typing:

```CMD
mklink /J [flow-launcher-plugin-folder]/[folder-name] [project-root]
```

An example would look like this:

```CMD
mklink /J C:\Users\Joel\AppData\Roaming\FlowLauncher\Plugins\flow-plugin C:\Users\Joel\code\flow-plugin
```

After this is set up. You can run:

```bash
npm install
npm run dev
```

To compile the code and then **restart** Flow Launcher and the plugin should be loaded.

> **Note**
>
> You **don't** need to restart Flow Launcher every time you make a change.

## Publishing

When you want to release and publish a new version, just push to the `main` branch and it wil automatically create a new release and tag with the correct versions.

To add the plugin to the official Flow Launcher plugin manifest, follow [this](https://github.com/Flow-Launcher/Flow.Launcher.PluginsManifest#readme) guide.
