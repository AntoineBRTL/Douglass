"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voice = void 0;
const say_1 = __importDefault(require("say"));
class Voice {
    constructor() {
        // les fautes c'est pour qu'il prononce bien haha ...
        say_1.default.speak("Salut, Douglass t'as bien eu ! Il va maintenant daitruire ton pc dans 30 secondes. La seule chose qu'il te reste a faire c'est de regarder ton pc mourir.");
    }
}
exports.Voice = Voice;
