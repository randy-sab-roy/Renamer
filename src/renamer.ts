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
    const form = $("#replace-form");
    let formText = $("<span></span>");

    variableCollection.getSymbols().forEach(s => 
        formText.append($("<span></span>").text(s.isVariable ? s.id : s.text).attr("class", s.isVariable ? "badge badge-success" : ""))
    );

    form.html("");
    form.append(formText);
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
}


$("#browse").on("click", () => promptToSelectFolder());
$("#file-search").on("input", () => applyFilter());
$("#replace-form").on("input", () => changeVariableText());
$("#replace-form").on("keypress", (e) => e.which != 13);