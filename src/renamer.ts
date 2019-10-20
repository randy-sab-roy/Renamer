import { remote } from "electron"

$("#browse").on("click", () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(v => {
        if (v != null) {
            $("#path").text(v.filePaths[0]);
        }
    });
})