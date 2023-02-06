"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const electron_1 = require("electron");
const Alterter_js_1 = require("./classes/Alerter/Alterter.js");
const Melter_js_1 = require("./classes/Melt/Melter.js");
const Voice_js_1 = require("./classes/Voice/Voice.js");
class Main {
    constructor() {
        new Alterter_js_1.Alerter();
        new Voice_js_1.Voice();
        new Melter_js_1.Melter();
    }
}
exports.Main = Main;
electron_1.app.whenReady().then(function () {
    new Main();
});
