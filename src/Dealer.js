export class Dealer {
    constructor(name){
        this.name = name;
        this.count = 0;
        this.niz = [];
        this.sit = document.querySelector("#sitdealer")
        
    }
    draw(idSpil, where){
        fetch(`https://deckofcardsapi.com/api/deck/${idSpil}/draw/?count=1`).then((res)=>{
            res.json().then((data) => {
                console.log(data);
                console.log(data.cards[0].value);
                switch(data.cards[0].value) {
                    case "ACE":
                        if (this.count + 11 > 21){
                            this.count += 1;
                            this.niz.push(1);
                        }
                        else{
                            this.count += 11;
                            this.niz.push(11);
                        };
                        break;
                    case "JACK":
                    case "QUEEN":
                    case "KING":
                        this.count += 10;
                        this.niz.push(10);
                        break;
                    default:
                        this.count += parseInt(data.cards[0].value);
                        this.niz.push(parseInt(data.cards[0].value));
                }
                if (this.count > 21){
                    console.log("bussted");
                }
                console.log(this.count);
                let karta = document.createElement("img");
                karta.src = data.cards[0].image;
                karta.id = "karta";
                where.appendChild(karta);
            })
        })
    }
    drawCard(idSpil, where){
        if (this.count < 17){
            this.draw(idSpil, where);
            let counter = document.querySelector("#countdealer > #counter");
            setTimeout(() =>{counter.innerHTML = this.count}, 1000);
        }
    }
}