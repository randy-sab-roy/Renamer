import { remote } from "electron"
import * as fs from "fs";
import * as path_module from "path";
import { VariableCollection } from "./variableCollection";

let directoryContent: Array<string> = new Array();
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

function getColorFromId(id: number, isLightColor: boolean = true): string {
    return "hsl(" + ((200 * id) % 360) + ',' +
        (95) + '%,' +
        (isLightColor ? 80 : 40) + '%)'
}

function updateHighlighting(): void {
    const echo = $("#interactive-echo");
    const currentText = $("#interactive-input").val() as string;
    const content = $("<span></span>");
    const parsedText = variableCollection.parseToSymbols(currentText);

    parsedText.forEach(s => content
        .append($("<span></span>")
            .text(s.text)
            .attr("style", s.isVariable && s.id > -1 ? 
                "background:" + getColorFromId(s.id) + ";border-radius:2px;box-shadow:0 0 0 1px " + getColorFromId(s.id, false) + ";" :
                "")));
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

function loadFolder(path: string): void {
    if (path == null)
        return;

    $("#path").text(path);

    directoryContent = new Array();
    fs.readdir(path, (_, files) => {
        files.forEach(f => directoryContent.push(f));
        applyFilter();
    })
}

function promptToSelectFolder(): void {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(dialogValue => {
        if (dialogValue != null && !dialogValue.canceled) {
            let path = dialogValue.filePaths[0];
            loadFolder(path);
        }
    });
}

function apply(): void {
    const path = $("#path").text();
    variableCollection.getTexts().forEach(t => {
        const originalPath = path_module.join(path, t.getOriginalText());
        const newPath = path_module.join(path, t.getUpdatedText());
        if (fs.existsSync(originalPath)) {
            fs.renameSync(originalPath, newPath);
        }
    });
    loadFolder(path);
}

$("#browse").on("click", () => promptToSelectFolder());
$("#file-search").on("input", () => applyFilter());
$("#interactive-input").on("input", () => onVariableTextChange());
$("#interactive-input").on("keypress", (e) => e.which != 13);
$("#apply").on("click", () => apply());