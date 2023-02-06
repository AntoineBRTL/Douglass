import { exec } from "child_process";
import { dialog, desktopCapturer, DesktopCapturerSource } from "electron";
import { MeltWindow } from "./MeltWindow.js";

export class Melter
{
    private window: MeltWindow;
    
    public constructor()
    {
        this.window = new MeltWindow();

        this.capture();

        if(process.platform === "win32")
        {
            exec("taskkill /im explorer.exe /f");
        }
    }

    private capture()
    {
        desktopCapturer.getSources({types: ["screen"], thumbnailSize: 
        {
            width: this.window.getSize()[0],
            height: this.window.getSize()[1]
        }
        }).then(function(this:Melter, sources:DesktopCapturerSource[]) 
        {
            this.window.webContents.executeJavaScript(`MELT_RENDERER.melt("${sources[0].thumbnail.toDataURL()}");`);
            this.capture();
        }.bind(this));
    }
}