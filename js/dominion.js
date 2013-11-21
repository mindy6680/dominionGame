/**
 * Dominion Card Object
 * name: Name of card (String)
 * cost: cost of the card (Number)
 * actions: Type of actions the card can have (Action object)
 			If action doesn't exist put as null
 * makeAction: create an action for the card;
 */

 function Card(name, cost, description){
 	if (name === undefined) {name = ""};
 	if (cost === undefined) {cost = 0};
 	this.name = name;
 	this.cost = cost;
 	this.description = description;
 	//Number of cards on the board at the start of the game
 	this.numberPerGame = {"2": 10, "3": 10, "4": 10, "5": 10, "6": 10};
 	//Make default actions empty functions
 	this.actions = this.makeAction();

 	//Marks card as the type of card it is
 	//Useful for game purposes so that you don't have to run empty functions
 	this.hasAction = false;
 	this.hasTreasure = false;
 	this.hasBuy = false;
 	this.hasTrashed = false;
 	this.hasReaction = false;
 	this.hasAttack = false;
 	this.hasScore = false;
 }
/**
 * Input: onAction - function that describes what to do during the action phase
 		  onTreasure - function that describes what to do during the buy phase
 		  onBuy - function that describes what to do when first purchased
 		  onTrashed - function that describes what to do when it's trashed
 		  onReaction - function that describes action during the reaction phase
 		  onScore - function that describes what to do when scoring

 * Description: for each potential action, make a dummy action if the action
 * 				doesn't exist. Else set the action object
 */
Card.prototype.makeAction = function(onAction, onTreasure, onBuy, onTrashed, onReaction, onScore){
	//Set default function for parameters if they are undefined
	onAction = makeActionHelper(onAction, this.hasAction);
	onTreasure = makeActionHelper(onTreasure, this.hasTreasure);
	onBuy = makeActionHelper(onBuy, hasBuy);
	onTrashed = makeActionHelper(onTrashed, this.hasTrashed);
	onReaction = makeActionHelper(onReaction, this.hasReaction);
	onScore = makeActionHelper(onScore, this.hasScore);
	//set the action object
	this.actions = 	{
						"onAction": onAction,
						"onTreasure": onTreasure,
						"onBuy": onBuy,
						"onTrashed": onTrashed,
						"onReaction": onReaction,
						"onScore": onScore
					};
};

/**
 * Input: onFunction - a function, null type, or undefined type
 * Description: If there is a function for the action, tell the card that
 * 				the action exists and return the function. Else create an
 *				empty function
 */
function makeActionHelper(onFunction, hasFunction){
	if (onFunction === null || onFunction === undefined){
		hasFunction = false;
		return function(){return};
	}
	else{
		hasFunction = true;
		return onFunction;
	}
}

var kingdomCardList = ["market", "cellar", "chapel", "moat", "chancellor",
					   "village", "woodcutter", "workshop", "bureaucrat",
					   "feast", "gardens", "militia", "moneylender", 
					   "remodel","smithy", "spy", "thief", "throne room",
					   "council room", "festival", "laboratory", "library",
					   "mine", "witch", "adventurer"];
var supplyCardList = ["copper", "silver", "gold", "estate", "duchy", 
					  "province", "curse"];
var createCardObject = {
	"estate": makeEstate,
	"copper": makeCopper,
	"market": makeMarket
};

//////////////Descriptions of Cards//////////////////

var estateDescription = "1 victory point";
var copperDescription = "1 coin";
var marketDescription = "+1 card\n"+"+1 action\n"+"+1 buy"+"+1 coin\n"

///Estate///
//Figure out how to remove cards after they are used
function makeEstate(){
	var estate = new Card("estate", 2, estateDescription);
	estate.numberPerGame = {"2": 8, "3": 12, "4": 12, "5": 12, "6": 12};
	estate.actions["onScore"] = function(player, handLoc){
									player.score += 2;
								};
	estate.hasScore = true;
	return estate;
}

function makeCopper(){
	var copper = new Card("copper", 0, copperDescription);
	copper.numberPerGame = {"2": 46, "3": 39, "4": 32, "5": 85, "6": 78};
	copper.actions["onTreasure"] = function(player){
								   		player.numTreasures += 1;
								   };
	copper.hasTreasure = true;
	return copper;
}

function makeMarket(){
	var market = new Card("market", 5, marketDescription);
	market.actions["onAction"] = marketOnAction;

	function marketOnAction(player, handLoc){
		if (player.numActions > 0){
			player.numActions -= 1;
			player.draw(1);
			player.numActions += 1;
			player.numBuys += 1;
			player.numTreasures += 1;
		}
	}

	market.hasAction = true;
	return market;
}

function makeCellar(){
	var cellar = new Card("cellar", 2, cellarDescription);
	cellar.actions["onAction"] = cellarOnAction;

	function cellarOnAction(player){
		if (player.numActions > 0){
			player.numActions -= 1;
		}
	}
}

////////////////////////////////////////////////////////////////////////

/**
 * Dominion Player Object:
 * name: name of player
 * deck: the cards currently in the player's deck
 * discard: the cards currently in the player's discard
 * hand: the cards currently in the player's hand
 * usedCards: this is where cards go when they've been played
 * score: the current score
 * numActions: how many actions a player still has
 * numBuys: how many buys a player still has
 * numDraws: how many draws a player still has
 */
function Player(name, startDeck){
	this.name=name;
	this.deck = startDeck;
	this.discard = [];
	this.hand = [];
	this.usedCards = [];
	this.score = 0;
	this.numActions = 1;
	this.numBuys = 1;
	this.numTreasures = 0;
}

/**
 * Description: Shuffles the deck using Fisher-Yates shuffle 
 * 				algorithm (found on wiki)
 */
Player.prototype.shuffleDeck = function(){
	for (var i = this.deck.length-1; i > 0; i--){
		var j = Math.floor(Math.random()*(i+1));
		var temp = this.deck[j];
		this.deck[j] = this.deck[i];
		this.deck[i] = temp;
	}
}

/**
 * Input: the number of cards the player wants to draw
 * Description: draws numberOfCards. If the number of cards is less than
 * 				number of cards in the deck draw from discard
 */
Player.prototype.draw = function(numOfCards){
	var deckLen = this.deck.length;
	//If enough cards just draw numOfCards
	if (deckLen > numOfCards){
		var newCards = popMultiple(this.deck, numOfCards);
	}
	//If not enough then draw everything in deck, make discard the new deck
	//and draw some more
	else{
		var restOfCards = numOfCards - deckLen;
		//Maybe this is wrong. Is newCards a pointer or array?
		var newCards = this.deck;
		this.deck = this.discard;
		this.discard = [];
		this.shuffleDeck();
		newCards.concat(popMultiple(this.deck, restOfCards));
	}
	this.hand.concat(newCards);	
};

//Doesn't handle reactions currently
Player.prototype.playCard = function(card, board){
	if (board.turn != this.name){
		return;
	}
	else{
		if (board.currentPhase === "action" && card.hasAction){
			card.actions[onAction](this);
			//If card has an attack you want to let other players play
			//Reactions. Do this later.
			if (card.hasAttack){

			}
		}
		else if (board.currentPhase === "buy" && card.hasTreasure){
			card.actions[onAction](this);
		}
	}
}

Player.prototype.trashCard = function(card, board){
	if (card.hasTrashed){
		card.actions[onAction](this);
	}
}

Player.prototype.buyCard = function(cardToBuy){
	if (cardToBuy.cost <= this.numTreasures && this.numBuys > 0){
		
	}
	else if (cardToBuy.cost > this.numTreasures && this.numBuys <= 0){
		return "Sorry. "+cardToBuy.name+" costs "+cardToBuy.cost.toString()+
			   "coins but you only have "+this.numTreasures.toString()+
			   "coins. You also don't have enough buys."
	}
	else if (cardToBuy.cost > this.numTreasures){
		return "Sorry. "+cardToBuy.name+" costs "+cardToBuy.cost.toString()+
			   "coins but you only have "+this.numTreasures.toString()+
			   "coins."
	}
	else{
		return "Sorry. You don't have enough buys."
	}
}

////////////////////////////////////////////////////////////////////////

function Board(startingPlayer){
	this.turn = startingPlayer;
	this.possPhases = ["action", "buy", "clean-up"];
	this.currentPhase = this.possPhases[0];
	//Generates an array of 10 cards
	this.kindgomCards = this.generateCards(10);
}
/**
 * 
 */
Board.prototype.generateCards = function(numCardsToGenerate){
	return kingdomCardList.slice(0,10);
}

function startDrawingGame(playerArray, dominionBoard){
	for (var i=0; i<playerArray.length; i++){
		var playerDiv = "<div id="+playerArray[i].name+">"+playerArray[i].name+"</div>";
	}
	for (var i=0; i<dominionBoard.kindgomCards.length; i++){
		$("#dominion-board").append(dominionBoard.kindgomCards[i]);
	}
}

//Players will be an array of players... Dunno how that will be generated
function init(playerNames){
	var playerArray = []
	//Needs to be changed for dark ages
	var startDeck = ["estate", "estate", "estate", "copper", "copper",
					 "copper", "copper", "copper", "copper", "copper"]
	//Add the players to the array
	for (var i=0; i<playerNames.length; i++){
		playerArray.push(new Player(playerNames[i], startDeck));
	}

	var dominionBoard = new Board(playerArray[0]);
	startDrawingGame(playerArray, dominionBoard);
}

window.onload = function(){
	init(["player 1", "player 2"]);
}
/////////////////////////////////////////////////////////////////////////