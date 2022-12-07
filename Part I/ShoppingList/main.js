const electron = require('electron')
const url = require('url')
const path = require('path')
const { protocol } = require('electron')

const {app, BrowserWindow, Menu, ipcMain} = electron

// Set Env
process.env.NODE_ENV = 'production'

let mainWindow
let addWindow

// Listen for App to be Ready
app.on('ready', () => {
    // Create New Window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    
    // Load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    //Quit app when closed
    mainWindow.on('close', () => {
        app.quit()
    })

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

    // Insert Menu
    Menu.setApplicationMenu(mainMenu)
})

// Handle create add Window
function createAddWindow() {
    // Create add Window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add Shopping List Item",
        // for electron work in html
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    // Load HTML into Window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }))

    // Garbage Collection Handle
    addWindow.on('close',() => {
        addWindow = null
    })
}

// Catch item:add
ipcMain.on('item:add', (e, item) => {
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow()
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
]

// If Mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({}) //add to the begining an empty object
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }, 
            {
                role: 'reload'
            }
        ]
    })
}