import {Dealer} from "./Dealer";

export class Player extends Dealer {
    constructor(name, balance, bet){
        super(name);
        this.balance = balance;
        this.bet = bet;
        this.sit = "";
    }

    drawCard(idSpil, where){
        if (this.count < 21){
            this.draw(idSpil, where);
        }
    }
    
    
}