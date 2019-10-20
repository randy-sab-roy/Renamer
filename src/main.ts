import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow;

function init(): void {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        icon: path.join(__dirname, "../assets/icon.png"),
        webPreferences: { nodeIntegration: true },
    });
    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, "../app/index.html"));
    mainWindow.on("close", () => { mainWindow = null });

    if (!app.isPackaged) {
        mainWindow.setMenu(Menu.buildFromTemplate([{
            label: "Options",
            submenu: [
                { label: "Dev Console", accelerator: "F12", click: () => mainWindow.webContents.openDevTools() },
                { label: "Reload", accelerator: "CommandOrControl+R", click: () => mainWindow.reload() }
            ]
        }]));
    }

    mainWindow.show();
}

app.on("ready", init);