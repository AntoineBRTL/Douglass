"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alerter = void 0;
const electron_1 = require("electron");
class Alerter {
    constructor() {
        electron_1.dialog.showErrorBox("Mais qu'est ce qu'il se passe ?", "Un Douglass sauvage apparait :D !");
    }
}
exports.Alerter = Alerter;
