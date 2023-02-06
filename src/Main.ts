import { app } from "electron";
import { Alerter } from "./classes/Alerter/Alterter.js";
import { Melter } from "./classes/Melt/Melter.js";
import { Voice } from "./classes/Voice/Voice.js";

export class Main
{
    public constructor()
    {
        new Alerter();
        new Voice();
        new Melter();
    }
}

app.whenReady().then(function()
{
    new Main();
})