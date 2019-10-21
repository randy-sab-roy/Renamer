import { remote } from "electron"
import * as fs from "fs";
import { VariableCollection } from "./variableCollection";

let directoryContent: Array<string> = new Array();
let filesToRename: Map<string, string> = new Map();
let variableCollection: VariableCollection;

function updateFileListView(): void {
    let fileList = $("#file-list");
    let replaceList = $("#replace-list");

    fileList.html("");
    replaceList.html("");

    for (let [key, value] of filesToRename) {
        fileList.append($("<li></li>").attr("class", "list-group-item").text(key))
        replaceList.append($("<li></li>").attr("class", "list-group-item").text(value))
    }
}

function updateVariableText(): void {
    variableCollection = new VariableCollection([...filesToRename.keys()]);
    const marker = variableCollection.getMarker();
    const form = $("#replace-form");
    let content = $("<span></span>");

    for (const s of variableCollection.getCollectionSymbols()) {
        if (s.isAssigned) {
            if (s.isVariable) {
                if (s.id > -1) {
                    content.append($("<span></span>").text(marker + s.id.toString() + marker).attr("class", "badge badge-success"));
                }
            }
            else {
                content.append($("<span></span>").text(s.text));
            }
        }
    }

    form.html("");
    form.append(content);
}

function changeVariableText(): void {
    // TODO
}

function applyFilter(): void {
    const filter = ($("#file-search").val() as string).toLowerCase();
    filesToRename.clear();
    directoryContent.filter(elem => elem.toLowerCase().indexOf(filter) > -1).forEach(f => filesToRename.set(f, f));
    updateFileListView();
    updateVariableText();
}

function promptToSelectFolder(): void {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(dialogValue => {
        if (dialogValue != null && !dialogValue.canceled) {
            let path = dialogValue.filePaths[0];
            $("#path").text(path);

            directoryContent = new Array();
            fs.readdir(path, (_, files) => {
                files.forEach(f => directoryContent.push(f));
                applyFilter();
            })
        }
    });
}


$("#browse").on("click", () => promptToSelectFolder());
$("#file-search").on("input", () => applyFilter());
$("#replace-form").on("input", () => changeVariableText());
$("#replace-form").on("keypress", (e) => e.which != 13);