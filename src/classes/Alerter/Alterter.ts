import {dialog} from "electron"

export class Alerter
{
    public constructor()
    {
        dialog.showErrorBox("Mais qu'est ce qu'il se passe ?", "Un Douglass sauvage apparait :D !");
    }
}