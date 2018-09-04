/*
 * Create a list that holds all of your cards
 */
const deck = document.getElementById("deck");
const cards = deck.getElementsByClassName("card");
let animating = false;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
shuffle(cards);


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
/* Events*/
deck.addEventListener("click", (e) =>
{
    let clickedCard = e.target.parentElement;
    if (clickedCard.classList.contains("card")) {
        openCard(clickedCard).then(() =>
        {
            if (countOpen() === 2) {
                if (validatePair()) {
                    //TODO
                } else {
                    shakeOpenCards().then(() =>
                    {
                        closeAllOpenCards();
                    });
                }
            }
        });
    }
});
/*Animations and transitions*/
function shakeOpenCards()
{
    return new Promise(function(resolve) {
        let openCards = deck.getElementsByClassName("opened");
        for (let card of openCards) {
            card.classList.add("noMatch");
        }
        openCards[0].addEventListener("animationend",
            function _tempShakeEnd(e)
            {
                openCards[0].removeEventListener(e.type, _tempShakeEnd,false);
                resolve(true);
            });
    });
    
}
function closeAllOpenCards()
{
    let openCards = deck.getElementsByClassName("opened");
    while (openCards.length > 0) {
        closeCard(openCards[0]);
    }
}
function openCard(card)
{
    return new Promise(function(resolve) {
        card.classList.add("open", "show");
        card.addEventListener("transitionend",
            function _tempTranEnd(e)
            {
                card.removeEventListener(e.type, _tempTranEnd,false);
                card.classList.remove("open");
                card.classList.add("opened");
                resolve(true);
            });
    });
    
}
function closeCard(card)
{
    card.classList.remove("opened", "show","noMatch");
}
/*Utilities */
function countOpen()
{
    let openCards = deck.getElementsByClassName("opened");
    return openCards.length;
}
/*Logic*/
function validatePair()
{
    return false;
}