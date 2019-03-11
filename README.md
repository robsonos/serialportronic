# Serialportronic

## Ionic Angular + Serialport + Electron

Minimal stater application using [Electron](https://electronjs.org/) and [Serialport](https://serialport.io/) in an [Ionic](https://ionicframework.com/)/

- [Angular](https://angular.io/) application.

## Prerequisites:

- [Node and npm](https://nodejs.org/en/download/)
- Additional node packages:

```
npm i -g ionic electron cross-env
```

- For windows development, install [Windows-Build-Tools](https://ionicframework.com/):

```
npm i -g windows-build-tools
```

## Installation

```
git clone https://github.com/robsonos/serialportronic.git
cd serialportronic
npm install
```

## Automated tasks

- Serving with hot reload

```
npm run serve
```

- Serving with hot reload (production mode)

```
npm run serve:prod
```

- Building

```
npm run build
```

- Packaging

```
npm run pack
```

- Distributing (current platform)

```
npm run dist
```

- Distributing (all platforms)

```
npm run dist:all
```

- Building and packaging

```
npm run build:pack
```

- Building and distributing (current platform)

```
npm run build:dist
```

- Building and distributing (all platforms)

```
npm run build:dist:all
```

PS: You may need to run the `build:pack` task before you run `serve` for the first time, as `electron-builder` will rebuild the required node modules for the current platform. The `pack` and `dist` tasks use the contents from the `www` folder, so you need to `build` the application first before using them. The application will be located inside `dist` folder.

## Built with

- [VS Code](https://code.visualstudio.com/)
- [Ionic framework](https://ionicframework.com)
- [Angular framework](https://angular.io/)
- [Electron](https://electronjs.org/)
- [Serialport](https://serialport.io/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Contributing

Pull requests for new features, bug fixes, and suggestions are welcome!

## Credits

This repo is based on [Sunghah](https://github.com/Sunghah/serialportron)`s serialportron project.
Icons made by [Freepik](https://www.freepik.com/) from [Flaticon](https://www.flaticon.com/) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)