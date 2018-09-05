/*
 * Create a list that holds all of your cards
 */
const cards = deck.getElementsByClassName("card");

function game()
{
    _this = this;
    _this.moves = 0;
    _this.busy = false;
    _this.deck = document.getElementById("deck");
    _this.starPannel = document.getElementById("stars");
    _this.movesSpan = document.getElementById("moves");
    _this.cardSymbol = [
        "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle",
        "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"
    ];
    _this.selectedCards = [];
    _this.cards = [];
    _this.gameStarted = false;
    _this.timeStarted = new Date().getTime() / 1000;
    _this.timeFinished = new Date().getTime() / 1000;
    _this.shuffle = () =>
    {
        let array = _this.cardSymbol;
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    };
    _this.match = () =>
    {
        for (let card of _this.selectedCards) {
            _this.matchCard(card);
        }
        _this.selectedCards = [];
        _this.busy = false;
    };
    _this.shakeOpenCards = () =>
    {
        return new Promise(function(resolve) {
            for (let card of _this.selectedCards) {
                card.classList.add("noMatch");
            }
            if (_this.selectedCards.length > 0) {
                _this.selectedCards[0].addEventListener("animationend",
                    function _tempShakeEnd(e) {
                        _this.selectedCards[0].removeEventListener(e.type, _tempShakeEnd, false);
                        resolve(true);
                    });
            };
        });
    };
    _this.validateCards = () =>
    {
        let symbol1 = _this.cardSymbol[_this.selectedCards[0].dataset.idx];
        let symbol2 = _this.cardSymbol[_this.selectedCards[1].dataset.idx];
        _this.moves++;
        _this.calcStars();
        return symbol1 === symbol2;
    };
    _this.createGame = () =>
    {
        _this.shuffle();
        for (let s of _this.cardSymbol.keys()) {
            _this.cards.push(_this.createCard(s));
        }
        _this.paintCards();
    };
    _this.paintCards = () =>
    {
        _this.deck.innerHTML = "";
        var documentFragment = document.createDocumentFragment();
        for (let c of _this.cards) {
            documentFragment.appendChild(c);
        }
        _this.deck.appendChild(documentFragment);
    };
    _this.createCard = (index) =>
    {
        let li = document.createElement('li');
        li.dataset.idx = index;
        li.classList.add('card');
        let back = document.createElement('div');
        back.classList.add("card_side", "back");
        let front = document.createElement('div');
        front.classList.add("card_side", "front");
        li.appendChild(back);
        li.appendChild(front);
        return li;
    };
    _this.openCard = (idx) =>
    {
        let card = _this.cards[idx];
        return new Promise(function(resolve) {
            _this.busy = true;
            let front = card.getElementsByClassName('front');
            front[0].innerHTML = `<i class="fa ${_this.cardSymbol[idx]}"></i>`;
            card.classList.add("open", "show");
            card.addEventListener("transitionend",
                function _tempTranEnd(e) {
                    card.removeEventListener(e.type, _tempTranEnd, false);
                    _this.selectedCards.push(card);
                    _this.busy = false;
                    resolve(true);
                });
        });
    };
    _this.closeAllOpenCards = () =>
    {
        for (let card of _this.selectedCards) {
            _this.closeCard(card);
        }
        _this.selectedCards = [];
        _this.busy = false;
    };
    _this.closeCard = (card) =>
    {
        card.classList.remove("open", "show", "noMatch");
        let front = card.getElementsByClassName('front');
        front[0].innerHTML = "";
    };
    _this.matchCard = (card) =>
    {
        card.classList.add("match");
    };
    _this.checkWin = () =>
    {
        if (_this.deck.getElementsByClassName("match").length === _this.cards.length) {
            //TODO
        }
    };
    _this.calcStars = () =>
    {
        if (_this.moves > 10) {
            _this.paintStars(1);
        } else if (_this.moves > 5) {
            _this.paintStars(2);
        } else {
            _this.paintStars(3);
        }
    };
    _this.paintStars = (qty) =>
    {
        _this.movesSpan.innerHTML = _this.moves;
        if (_this.starPannel.getElementsByClassName("fa-star").length != qty) {
            let documentFragment = document.createDocumentFragment();
            for (let x = 0; x < qty; x++) {
                let li = document.createElement("li");
                let i = document.createElement("i");
                i.classList.add("fa", "fa-star");
                li.appendChild(i);
                documentFragment.appendChild(li);
            }
            for (let x = 0; x < 3 - qty; x++) {
                let li = document.createElement("li");
                let i = document.createElement("i");
                i.classList.add("fa", "fa-star-o");
                li.appendChild(i);
                documentFragment.appendChild(li);
            }
            _this.starPannel.innerHTML = "";
            _this.starPannel.appendChild(documentFragment);
        };
    }
};

var activeGame = new game();
activeGame.createGame();

activeGame.deck.addEventListener("click",
    (e) =>
    {
        if (activeGame.busy) return;
        let clickedCard = e.target.parentElement;
        if (clickedCard.classList.contains("card")) {
            let idx = clickedCard.dataset.idx;
            activeGame.openCard(idx).then(() =>
            {
                if (activeGame.selectedCards.length === 2) {
                    if (activeGame.validateCards()) {
                        activeGame.match();

                    } else {
                        activeGame.shakeOpenCards().then(() =>
                        {
                            activeGame.closeAllOpenCards();
                        });
                    }
                }
            });
        }
    });