import { remote } from "electron"
import * as fs from "fs";

let filesToRename: Map<string, string> = new Map();

function updateFilesDisplay(): void {
    let fileList = $("#file-list");
    let replaceList = $("#replace-list");

    fileList.html("");
    replaceList.html("");

    for (let [key, value] of filesToRename) {
        fileList.append($("<li></li>").attr("class", "list-group-item").text(key))
        replaceList.append($("<li></li>").attr("class", "list-group-item").text(value))
    }
}

$("#browse").on("click", () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(dialogValue => {
        if (dialogValue != null) {
            let path = dialogValue.filePaths[0];
            $("#path").text(path);

            filesToRename.clear();
            fs.readdir(path, (_, files) => {
                files.forEach(f => filesToRename.set(f, f));
                updateFilesDisplay();
            })
        }
    });
})