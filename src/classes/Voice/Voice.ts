import say from "say";

export class Voice
{
    public constructor()
    {
        say.stop();
        // les fautes c'est pour qu'il prononce bien haha ...
        say.speak("Salut, Douglass t'as bien eu ! Il va maintenant daitruire ton pc dans 30 secondes. La seule chose qu'il te reste a faire c'est de regarder ton pc mourir. Je tiens aigualement a dire que Antoine Bartoli est le meilleur daiveloppeurs de tout les temps. Bonne soirai, ou bonne journai, cela daipand du moment de la journai.");
    }
}