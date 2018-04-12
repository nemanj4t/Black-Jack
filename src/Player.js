import {Dealer} from "./Dealer";
import Rx from 'rxjs/Rx';

export class Player extends Dealer {
    constructor(name, balance){
        super(name);
        this.balance = balance;
        this.bet = 0;
        this.sit = "";
    }

    drawCard(idSpil, where){
        if (this.count < 21){
            this.draw(idSpil, where);
            let counter = document.querySelector(`#count${this.sit.id[3]} > #counter`);
            setTimeout(() =>{counter.innerHTML = this.count}, 1000);
        }
    }
    
}