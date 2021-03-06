const {app, BrowserWindow, Menu} = require('electron');

const fs = require('fs');
let rawdata = fs.readFileSync(`${__dirname}/../data/user_data.json`);
let user_data = JSON.parse(rawdata);


app.on('ready', _ => {
    
    if(user_data["WELCOME_STATUS"] == 0){

        loginWindow = new BrowserWindow({
            show: false,
            modal: true,
            titleBarStyle: 'hiddenInset',
            backgroundColor: '#2c2c2c',
            resizable: false,
            fullscreenable: false,
            height: 800,
            width: 1200
        })

        loginWindow.loadURL(`file://${__dirname}/welcome.html`)

        loginWindow.once('ready-to-show', () => {
            loginWindow.show()
        })
    } else {

        const mainWindow = new BrowserWindow({
            height: 600,
            width: 435,
            minWidth: 300,
            fullscreenable: false,
            backgroundColor: '#2c2c2c',
            titleBarStyle: 'hidden'
        });

        mainWindow.loadURL(`file://${__dirname}/index.html`);

    }

    app.on('window-all-closed', () => {
        app.quit()
    })


    // Menu settings

    const menuTemplate = [
        {
          label: 'Edit',
          submenu: [
            {
              role: 'undo'
            },
            {
              role: 'redo'
            },
            {
              type: 'separator'
            },
            {
              role: 'cut'
            },
            {
              role: 'copy'
            },
            {
              role: 'paste'
            },
            {
              role: 'pasteandmatchstyle'
            },
            {
              role: 'delete'
            },
            {
              role: 'selectall'
            }
          ]
        },
        {
          label: 'View',
          submenu: [
            {
              label: 'Reload',
              accelerator: 'CmdOrCtrl+R',
              click (item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload()
              }
            },
            {
              type: 'separator'
            },
            {
              role: 'resetzoom'
            },
            {
              role: 'zoomin'
            },
            {
              role: 'zoomout'
            },
            {
              type: 'separator'
            },
            {
              role: 'togglefullscreen'
            }
          ]
        },
        {
          role: 'window',
          submenu: [
            {
              role: 'minimize'
            },
            {
              role: 'close'
            }
          ]
        },
        {
          role: 'help',
          submenu: [
            {
                label: 'Reset Pingdom Desktop',
                click() {
                    const fs = require('fs');

                    let default_data = {
                      "WELCOME_STATUS":0,
                      "API_KEY":"",
                      "DASHBOARD_PREFERENCES": [
                          {
                              "WARN_RESPONSE_TIME": 2000,
                              "COLOR_GOOD": "#11D15C",
                              "COLOR_WARN": "#F99E1D",
                              "COLOR_DOWN": "#D11126"
                          }
                      ]
                  };
    
                    let data = JSON.stringify(default_data);
                    fs.writeFileSync(`${__dirname}/../data/user_data.json`, data);

                    app.relaunch();
                    app.quit();
                }
            },
            {
              label: 'Edit Preferences',
              click() {
                  const shell = require('electron').shell;
                  const path = require('path');

                  shell.openItem(`${__dirname}/../data/user_data.json`);
              }
            }
          ]
        }
    ]
      
    if (process.platform === 'darwin') {
        const name = app.getName()
        menuTemplate.unshift({
          label: name,
          submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Open Repository',
                click () { require('electron').shell.openExternal('https://github.com/jordanwalster/pingdom-desktop') }
            },
            {
                type: 'separator'
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
          ]
        })
        // Edit menu.
        menuTemplate[1].submenu.push(
          {
            type: 'separator'
          },
          {
            label: 'Speech',
            submenu: [
              {
                role: 'startspeaking'
              },
              {
                role: 'stopspeaking'
              }
            ]
          }
        )
        // Window menu.
        menuTemplate[3].submenu = [
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          },
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
          },
          {
            label: 'Zoom',
            role: 'zoom'
          },
          {
            type: 'separator'
          },
          {
            label: 'Bring All to Front',
            role: 'front'
          }
        ]
    }
      
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
})
