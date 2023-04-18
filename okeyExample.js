//Toplam bulunan taşlar
const cards = Array.from(Array(53).keys()).reduce((m, i) => m.concat([i, i]), []);

//Bir dizide taşlar rastgele karıştırılır
cards.sort(() => Math.random() - 0.5)

//Rastgele bir taş seçilir
let card = cards[Math.floor(Math.random() * cards.length)]

//Sahte okey seçilirse tekrar rastgele seçim yapılır
while (card == 52) {
    card = cards[Math.floor(Math.random() * cards.length)]
}

//Okey taşı seçilir
card = (card == 12 || card == 25 || card == 38 || card == 51) ? (card - 12) : (card + 1)

//Sahte okey taşı, okey taşı olarak düşünülür
cards.forEach(function(item, i) { if (item == 52) cards[i] = card; });

class Player {
    cards = []
    constructor(randomCards, identity) {
        this.cards = randomCards
        this.identity = identity
    }
    countOfToOkey() {
        const sequentialCards = [];
        let bufferCards = this.cards
        this.cards.sort((a,b)=> a-b)

        for(let i=0; i < (this.cards.length -1); i++) {
            if((this.cards[i] == (this.cards[i+1] - 1)) && (this.cards[i] != 12 && this.cards[i] != 25 && this.cards[i] != 38  && this.cards[i] != 51)) {
                let index = -1
                sequentialCards.forEach((elem,inn) => {
                    if(elem[elem.length-1] == this.cards[i]) {
                        index = inn
                    }
                })
                if(index != -1)
                sequentialCards[index].push(this.cards[i+1])
                else
                sequentialCards.push([this.cards[i], this.cards[i+1]])
                bufferCards = bufferCards.filter(item => item !== this.cards[i] && item !== this.cards[i+1])
            }
            else if((this.cards[i] == 12 || this.cards[i] == 25 || this.cards[i] == 38  || this.cards[i] == 51) && (this.cards.includes(this.cards[i] - 12))){
                let index = -1
                sequentialCards.forEach((elem,inn) => {
                    if(elem.includes(this.cards[i] - 12) && !elem.includes(this.cards[i])) {
                        index = inn
                    }
                })
                if(index != -1)
                sequentialCards[index].unshift(this.cards[i])
                else
                sequentialCards.push([this.cards[i], this.cards[i] - 12])
                bufferCards = bufferCards.filter(item => item !== this.cards[i] && item !== this.cards[i+1])
            }
        }
        
        let pairCards = bufferCards.filter(num => bufferCards.includes(num+13) || bufferCards.includes(num+26) || bufferCards.includes(num+39) || bufferCards.includes(num-26) || bufferCards.includes(num-39)|| bufferCards.includes(num-13));
        
        pairCards = [...new Set(pairCards)]

        //paircards kısmında çiftler bulunmakta fakat farklı çiftlerde bulunmaktadır

        bufferCards.forEach(elem => {
            if(pairCards.includes(elem))
            bufferCards = bufferCards.filter(item => item !== elem)
        })

        if(bufferCards.includes(card))
        sequentialCards[sequentialCards.length-1].push(card)

        return sequentialCards.length + pairCards.length
    
    }
}

//Taşlar oyunculara dağıtılır
const player1 = new Player(cards.slice(0, 15), 'Player 1');
const player2 = new Player(cards.slice(15, 29), 'Player 2');
const player3 = new Player(cards.slice(29, 43), 'Player 3');

function compareCards(el1, el2, el3) {
    const maxNumber = Math.max(el1.countOfToOkey(), el2.countOfToOkey(), el3.countOfToOkey());
    return maxNumber == el1.countOfToOkey() ? el1.identity : (maxNumber == el2.countOfToOkey() ? el2.identity : el3.identity)
}

const result = compareCards(player1, player2, player3);
console.log('Winner is :', result)
