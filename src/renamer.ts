import { remote } from "electron"
import * as fs from "fs";

let directoryContent: Array<string> = new Array();
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

function applyFilter(): void {
    const filter = $("#file-search").val() as string;
    filesToRename.clear();    
    directoryContent.filter(elem => elem.toLowerCase().indexOf(filter) > -1).forEach(f => filesToRename.set(f, f));
    updateFilesDisplay();
}

$("#browse").on("click", () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(dialogValue => {
        if (dialogValue != null) {
            let path = dialogValue.filePaths[0];
            $("#path").text(path);

            directoryContent = new Array();
            fs.readdir(path, (_, files) => {
                files.forEach(f => directoryContent.push(f));
                applyFilter();
            })
        }
    });
});

$("#file-search").on("input", () => {
    applyFilter();
});