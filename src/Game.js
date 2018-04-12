import {Player} from "./Player";
import {Dealer} from "./Dealer";

import Rx from 'rxjs/Rx';


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
                let idSpila = document.createElement("p");
                let imeDilera = document.createElement("p");
                let div = document.querySelector("#dealer");
                idSpila.innerHTML = `ID of Deck: <strong>${this.idSpil}</strong>`;
                imeDilera.innerHTML = `Name: <i>${this.dealer.name}</i>`;
                div.appendChild(imeDilera);
                div.appendChild(idSpila);

                setTimeout(() =>{this.player.drawCard(this.idSpil, this.player.sit)}, 1000);
                setTimeout(() =>{this.dealer.drawCard(this.idSpil, this.dealer.sit)}, 2000);
                setTimeout(() =>{this.player.drawCard(this.idSpil, this.player.sit)}, 3000);
                setTimeout(() =>{
                    if(this.player.count == 21){
                        this.finish();
                    }
                }, 4000);
            })
        })
    }

    finish(){
        // dealer finishes
        for(let i = 1; i < 7; i++){
            setTimeout(()=>{this.dealer.drawCard(this.idSpil, this.dealer.sit)}, i*1000);  
        }
        //evaluation
        setTimeout(() => {
            let karte = [];
            let nizDealer = [];
            nizDealer.push("Dealer");
            nizDealer.push(this.dealer.niz);
            nizDealer.push(this.dealer.count);
            let nizPlayer = [];
            nizPlayer.push(this.player.name);
            nizPlayer.push(this.player.niz);
            nizPlayer.push(this.player.count);
            let evaluationNiz = [];
            karte.push("dealer")
            karte.push(nizPlayer);
            karte.push(nizDealer);
            

            let karte$ = Rx.Observable.from(karte);
            karte$.subscribe(
                v => {
                    console.log(v);
                    let e = 0;
                    let help = [];
                    help = v[1];
                    console.log(v[1].length);
                    if(v[1].length == 2 && v[2] == 21){
                        e += 3;
                    }
                    if(v[2] == 21){
                        e += 2;
                    }
                    if(v[2] < 21){
                        e += 1;
                    }
                    if(v[2] > 21){
                        e -= 1;
                    }
                    evaluationNiz.push(e);
                    console.log(e);
                },
                err => {
                    console.log(err);    
                },
                complete => {
                    let nizDraw = ["not decided!"];
                    console.log(evaluationNiz);
                    if(evaluationNiz[1] > evaluationNiz[2]){
                        this.message(nizPlayer);
                        if (evaluationNiz[1] == 6){
                            this.playerWins("BlackJack");
                        }
                        else{
                            this.playerWins("notBlackJack");
                        }
                        console.log("player wins");
                    }else if(evaluationNiz[1] < evaluationNiz[2]){
                        this.message(nizDealer);
                        this.dealerWins();
                        console.log("dealer wins");
                    }else if(evaluationNiz[1] == evaluationNiz[2] && evaluationNiz[1] < 0){
                        this.message(nizDraw);
                        this.gameIsDraw();
                        console.log("nereseno");
                    }else if(nizPlayer[2] > nizDealer[2]){
                        this.message(nizPlayer);
                        this.playerWins("notBlackJack");
                        console.log("player wins");
                    }else if(nizPlayer[2] < nizDealer[2]){
                        this.message(nizDealer);
                        this.dealerWins();
                        console.log("dealer wins");
                    }else{
                        this.message(nizDraw);
                        this.gameIsDraw();
                        console.log("nereseno");
                    }
                    
                    
                });

        }, 7000);

    }

    message(niz){
        let parent = document.querySelector("#countdealer");
        let div = document.createElement("div");
        div.id = "message";
        parent.appendChild(div);
        let name = document.createElement("p");
        name.innerHTML = `Winner is ${niz[0]}!<hr>`;
        div.appendChild(name);
        let newButton = document.createElement("button");
        newButton.innerHTML = "NEXT";
        let standButton = document.createElement("button");
        standButton.innerHTML = "STAND UP";
        div.appendChild(newButton);
        div.appendChild(standButton);
        
        newButton.onclick = () =>{
            let child = newButton.parentElement;
            child.parentNode.removeChild(child);
            this.prepare();
            this.gameLogic();
        }

        standButton.onclick = () =>{
            let child = newButton.parentElement;
            child.parentNode.removeChild(child);
            this.prepareToStand();
            for(let i = 1; i <= 3; i++){
                let sitButton = document.createElement("div");
                sitButton.id = "sitButton";
                sitButton.innerHTML = `<span>SIT</span>`;
                document.getElementById(`${i}`).appendChild(sitButton);
            }
            let b = document.querySelectorAll("#sitButton");
            b.forEach((element) => {
                
                element.onclick = () =>{
                    this.player.sit = document.querySelector(`#sit${element.parentElement.id}`);
                    b.forEach((el)=>{
                        el.onclick = false;
                    })
                    element.parentElement.innerHTML = "";
                    this.gameLogic();
                }
            })
        }
    }

    playerWins(prom){
        if(prom == "BlackJack"){
            this.player.balance += 3*this.player.bet;
        }
        else{
            this.player.balance += 2*this.player.bet;
        }
        this.player.bet = 0;
        let betIn = document.querySelector("#bet");
        let balance = document.querySelector("#balance");
        betIn.innerHTML = `Bet: <strong>${this.player.bet}$</strong>`;
        balance.innerHTML = `Balance: <strong>${this.player.balance}$</strong>`;
    }

    dealerWins(){
        this.player.bet = 0;
        let betIn = document.querySelector("#bet");
        betIn.innerHTML = `Bet: <strong>${this.player.bet}$</strong>`;
    }

    gameIsDraw(){
        this.player.balance += this.player.bet;
        this.player.bet = 0;
        let betIn = document.querySelector("#bet");
        let balance = document.querySelector("#balance");
        betIn.innerHTML = `Bet: <strong>${this.player.bet}$</strong>`;
        balance.innerHTML = `Balance: <strong>${this.player.balance}$</strong>`;
    }
    
    prepare(){
        this.player.niz = [];
        this.player.sit.innerHTML = "";
        this.dealer.sit.innerHTML = "";
        this.dealer.count = 0;
        this.player.count = 0;
        document.querySelectorAll("#dealer > p").forEach((element) => {
            document.querySelector("#dealer").removeChild(element);
        });
        document.getElementById(`${this.player.sit.id[3]}`).innerHTML = "";
        document.querySelector(`#count${this.player.sit.id[3]} > #counter`).innerHTML = "";
        document.querySelector(`#countdealer > #counter`).innerHTML = "";
    }

    prepareToStand(){
        this.prepare();
        for(let i = 1; i <= 3; i++){
            let parent = document.getElementById(`${i}`);
            parent.innerHTML = "";
        }
    }

    gameLogic(){
        let parent = document.getElementById(`${this.player.sit.id[3]}`);
        console.log(this.player.sit.id[3]);
        for (let i= 1; i <= 5; i++){
            let bet = document.createElement("button");
            bet.innerHTML=`${i*5}`;
            bet.value = i*5;
            parent.appendChild(bet);
            bet.onclick = () =>{
                if (this.player.balance >= parseInt(bet.value)){
                    this.player.bet += parseInt(bet.value);
                    this.player.balance -= parseInt(bet.value);
                    let betIn = document.querySelector("#bet");
                    let balance = document.querySelector("#balance");
                    betIn.innerHTML = `Bet: <strong>${this.player.bet}$</strong>`;
                    balance.innerHTML = `Balance: <strong>${this.player.balance}$</strong>`;
                    console.log(this.player.bet);
                }
            }
        }

        let reset = document.createElement("button");
        reset.innerHTML = "CLR";
        parent.appendChild(reset);
        reset.onclick = () =>{
            this.player.balance += this.player.bet;
            this.player.bet = 0; 
            let betIn = document.querySelector("#bet");
            let balance = document.querySelector("#balance");
            betIn.innerHTML = `Bet: <strong>${this.player.bet}$</strong>`;
            balance.innerHTML = `Balance: <strong>${this.player.balance}$</strong>`;
            console.log(this.player.bet);
        }
        
        let done = document.createElement("button");
        done.innerHTML = "DONE";
        let name = document.createElement("p");
        name.innerHTML = `Name: <i>${this.player.name}</i>`;
        let balance = document.createElement("p");
        balance.id = "balance";
        balance.innerHTML = `Balance: <strong>${this.player.balance}$</strong>`;
        let bet = document.createElement("p");
        bet.id = "bet";
        bet.innerHTML = `Bet: <strong>${this.player.bet}$</strong>`;
        parent.appendChild(name);
        parent.appendChild(balance);
        parent.appendChild(bet);
        
        parent.appendChild(done);
        done.onclick = () => {
            if (this.player.bet > 0){
                parent.innerHTML = "";
                let hitbtn = document.createElement("button");
                hitbtn.innerHTML = "HIT";
                hitbtn.disabled = true;
                let standbtn = document.createElement("button");
                standbtn.innerHTML = "STAND";
                standbtn.disabled = true;
                let doublebtn = document.createElement("button");
                doublebtn.innerHTML = "DOUBLE";
                doublebtn.disabled = true;
                let name = document.createElement("p");
                name.innerHTML = `Name: <i>${this.player.name}</i>`;
                let balance = document.createElement("p");
                balance.id = "balance";
                balance.innerHTML = `Balance: <strong>${this.player.balance}$</strong>`;
                let bet = document.createElement("p");
                bet.id = "bet";
                bet.innerHTML = `Bet: <strong>${this.player.bet}$</strong>`;

                parent.appendChild(hitbtn);
                parent.appendChild(standbtn);
                parent.appendChild(doublebtn);
                parent.appendChild(name);
                parent.appendChild(balance);
                parent.appendChild(bet);
                
                this.start();
                setTimeout(()=>{
                    hitbtn.disabled = false;
                    standbtn.disabled = false;
                    doublebtn.disabled = false;
                },3000);
                
                hitbtn.onclick = () => {
                    this.player.drawCard(this.idSpil, this.player.sit);
                    setTimeout(() =>{
                        if (parseInt(document.querySelector(`#count${this.player.sit.id[3]} > #counter`).innerHTML)>=21){
                            hitbtn.disabled = true;
                            standbtn.disabled = true;
                            doublebtn.disabled = true;
                            this.finish();
                        }
                    },2000);
                }
                standbtn.onclick = () => {
                    hitbtn.disabled = true;
                    standbtn.disabled = true;
                    doublebtn.disabled = true;
                    this.finish();
                }
                doublebtn.onclick = () => {
                    if(this.player.count < 21){
                        this.player.drawCard(this.idSpil, this.player.sit);
                        this.player.balance -= this.player.bet;
                        this.player.bet *=2;
                        let betIn = document.querySelector("#bet");
                        let balance = document.querySelector("#balance");
                        betIn.innerHTML = `bet: <strong>${this.player.bet}$</strong>`;
                        balance.innerHTML = `Balance: <strong>${this.player.balance}$</strong>`;
                        doublebtn.disabled = true;
                    }
                    setTimeout(() =>{
                        if (parseInt(document.querySelector(`#count${this.player.sit.id[3]} > #counter`).innerHTML)>=21){
                            hitbtn.disabled = true;
                            standbtn.disabled = true;
                            doublebtn.disabled = true;
                            game.finish();
                        }
                    },2000);

                }
            }
        }
    }
}