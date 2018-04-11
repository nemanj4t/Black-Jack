import {Player} from "./Player";
import {Dealer} from "./Dealer";
import {Game} from "./Game";
//import {Card} from "./Card";
console.log('Pro');

let game = new Game(new Dealer("Nemanja"), new Player("mica", 12000, 10));


let b = document.querySelectorAll("button");



b.forEach((element) => {
    element.onclick = () =>{
        let parent = element.parentElement;
        game.player.sit = document.querySelector(`#sit${element.parentElement.id}`);
        parent.innerHTML = "";
        for (let i= 1; i <= 5; i++){
            let bet = document.createElement("button");
            bet.innerHTML=`${i*5}`;
            bet.value = i*5;
            parent.appendChild(bet);
            bet.onclick = () =>{
                game.player.bet += parseInt(bet.value);
                console.log(game.player.bet);
            }
        }

        let reset = document.createElement("button");
        reset.innerHTML = "CLR";
        parent.appendChild(reset);
        reset.onclick = () =>{
            game.player.bet = 0;
            console.log(game.player.bet);
        }
        
        let done = document.createElement("button");
        done.innerHTML = "DONE";
        parent.appendChild(done);
        done.onclick = () => {
            parent.innerHTML = "";
            let hitbtn = document.createElement("button");
            hitbtn.innerHTML = "HIT";
            let standbtn = document.createElement("button");
            standbtn.innerHTML = "STAND";
            let doublebtn = document.createElement("button");
            doublebtn.innerHTML = "DOUBLE";
            parent.appendChild(hitbtn);
            parent.appendChild(standbtn);
            game.start();
    
            hitbtn.onclick = () => {
                game.player.drawCard(game.idSpil, game.player.sit);
            }
            standbtn.onclick = () => {
                game.finish();
            }
            doublebtn.onclick = () => {
                //
            }
        }  
    }
})


  