import {Player} from "./Player";
import {Dealer} from "./Dealer";
import {Game} from "./Game";

document.querySelector("#login").onclick = () =>{
    const name = document.querySelector("#name").value;
    document.querySelector("#message").parentNode.removeChild(document.querySelector("#message"));


    const game = new Game(new Dealer("Nemanja"), new Player(`${name}`, 200));
    
    for(let i = 1; i <= 3; i++){
        let sitButton = document.createElement("div");
        sitButton.id = "sitButton";
        sitButton.innerHTML = `<span>SIT</span>`;
        document.getElementById(`${i}`).appendChild(sitButton);
    }
    let b = document.querySelectorAll("#sitButton");
    b.forEach((element) => {
        element.onclick = () =>{
            let parent = element.parentElement;
            game.player.sit = document.querySelector(`#sit${element.parentElement.id}`);
            b.forEach((el)=>{
                el.onclick = false;
            })
            parent.innerHTML = "";
            game.gameLogic();
        }  
    })
}


  