const {BrowserWindow} = require('electron')

class MainWindow extends BrowserWindow {
    constructor (file, isDev) {
        //Invoca o construtor do BrowserWindow
        super({
            title: 'CPU Monitor',
            width: isDev ? 1000 : 355,
            height: 500,
            icon: './assets/icons/icon.png',
            resizable: isDev ? true : false,
            show: false,
            opacity: 0.95,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
        })

        this.loadFile(file)

        if (isDev) {
            this.webContents.openDevTools()
        }
    }
}

module.exports = MainWindow