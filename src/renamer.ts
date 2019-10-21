import { remote } from "electron"
import * as fs from "fs";
import { VariableCollection } from "./variableCollection";

let directoryContent: Array<string> = new Array();
// let filesToRename: Map<string, string> = new Map();
let variableCollection: VariableCollection;

function updateFileListView(): void {
    let fileList = $("#file-list");
    let replaceList = $("#replace-list");

    fileList.html("");
    replaceList.html("");

    for (let text of variableCollection.getTexts()) {
        fileList.append($("<li></li>").attr("class", "list-group-item").text(text.getOriginalText()));
        replaceList.append($("<li></li>").attr("class", "list-group-item").text(text.getUpdatedText()));
    }
}

function updateHighlighting(): void {
    const marker = variableCollection.getMarker();
    const form = $("#interactive-input");
    const echo = $("#interactive-echo");
    const currentText = form.val() as string;

    let content = $("<span></span>");
    let isWritingVar = false;
    let lastIndex = 0;

    for (let i = 0; i < currentText.length; i++) {
        if (currentText.charAt(i) == marker) {
            if (i - lastIndex > 0) {
                content.append($("<span></span>").text(currentText.substring(lastIndex, isWritingVar ? i + 1 : i)).attr("class", isWritingVar ? "highlight" : ""));
            }
            lastIndex = isWritingVar ? i + 1 : i;
            isWritingVar = !isWritingVar;
        }
    }

    echo.html("");
    echo.append(content);
}

function onVariableTextChange(): void {
    variableCollection.updateFromCollectionString($("#interactive-input").val() as string);
    updateFileListView();
    updateHighlighting();
}

function updateVariableTextField(): void {
    $("#interactive-input").val(variableCollection.getCollectionString());
    updateHighlighting();
}

function applyFilter(): void {
    const filter = ($("#file-search").val() as string).toLowerCase();
    variableCollection = new VariableCollection(directoryContent.filter(elem => elem.toLowerCase().indexOf(filter) > -1));
    updateFileListView();
    updateVariableTextField();
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
$("#interactive-input").on("input", () => onVariableTextChange());
$("#interactive-input").on("keypress", (e) => e.which != 13);