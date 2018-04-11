import {Player} from "./Player";
import {Dealer} from "./Dealer";


export class Game {
    constructor(dealer, player){
        this.dealer = dealer;
        this.player = player;
        this.idSpil = "";
    }

    start(){
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then((res)=>{
            res.json().then((data) => {
                console.log(data);
                this.idSpil = data.deck_id;
                setTimeout(() =>{this.player.drawCard(this.idSpil, this.player.sit)}, 1000);
                setTimeout(() =>{this.dealer.drawCard(this.idSpil, this.dealer.sit)}, 2000);
                setTimeout(() =>{this.player.drawCard(this.idSpil, this.player.sit)}, 3000);
            })
        })
    }

    finish(){
        // dealer finishes
        for(let i = 1; i < 7; i++){
            setTimeout(()=>{this.dealer.drawCard(this.idSpil, this.dealer.sit)}, i*1000);  
        }

        setTimeout(() => {
            //
        }, 7000);

    }
        
}