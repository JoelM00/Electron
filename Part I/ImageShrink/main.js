const path = require('path')
const os = require('os')
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const imagemin = import('imagemin')
const imageminMozjpeg = import('imagemin-mozjpeg')
const imageminPngquant = import('imagemin-pngquant')
const log = require('electron-log')

// Set Env
process.env.NODE_ENV  = 'production'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow
let aboutWindow

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: isDev? 1000 : 500,
        height: 600,
        icon: './assets/icons/Icon_256x256.png',
        resizable: isDev ? true : false,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    if (isDev) {
        mainWindow.webContents.openDevTools()
    }

    mainWindow.loadFile('./app/index.html')
}

function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        title: 'About ImageShrink',
        width: 300,
        height: 300,
        icon: './assets/icons/Icon_256x256.png',
        resizable: false,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    aboutWindow.loadFile('./app/about.html')

}

app.on('ready',() => {
     createMainWindow()

    mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    /* Ja estao inseridos devido as
    globalShortcut.register('CmdOrCtrl+R',() => {
        mainWindow.reload()
    })

    globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+k',() => {
        mainWindow.toggleDevTools()
    })*/

    mainWindow.on('closed', _ => {
        console.log('closed')
        mainWindow = null
    })
})

const menu = [ 
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
    }] : []),
    {   
        /*
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                //accelerator: isMac ? 'Command+W' : 'Ctrl+W',
                accelerator: 'CmdOrCtrl+W',
                click: () => app.quit()
            }
        ]*/
        role: 'fileMenu' //subtitui o de cima
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ]: []),
    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { type: 'separator' },
                { role: 'toggledevtools' },
            ]
        }
    ] : [])
]


if (isMac) {
    menu.unshift({
        role: 'appMenu'
    })
}

async function shrinkImage({imgPath, quality, dest}) {

    try {
        const pngQuality = quality / 100
        const files = (await imagemin).default([path.join(imgPath)], {
            destination: dest,
            plugins: [
                (await imageminMozjpeg).default({quality}),
                (await imageminPngquant).default({
                    quality: [pngQuality, pngQuality]
                })
            ]
        })
        log.info(files)

        shell.openPath(dest)

        mainWindow.webContents.send('image:done')

    } catch (err) {
        console.log(err)
        log.error(err)
    }
}

ipcMain.on('image:minimize',(e, options) => {
    options.dest = path.join(os.homedir(),'imageshrink')
    shrinkImage(options)
})


app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})


app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})
