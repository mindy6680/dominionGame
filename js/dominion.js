(function(){

	function printDecks(player){
		console.log("player deck: "+player.deck);
		console.log("player hand: "+player.hand);
		console.log("player used: "+player.usedCards);
		console.log("player discard: "+player.discard);
	}

	var board;
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
	 	this.actions = this.makeAction(null, null, null, null, null, null);

	 	//Marks card as the type of card it is
	 	//Useful for game purposes so that you don't have to run empty functions
	 	this.hasAction = false;
	 	this.hasCoin = false;
	 	this.hasBuy = false;
	 	this.hasTrashed = false;
	 	this.hasReaction = false;
	 	this.hasAttack = false;
	 	this.hasScore = false;
	 	this.isBasicCoin = false;
	 }
	/**
	 * Input: onAction - function that describes what to do during the action phase
	 		  onCoin - function that describes what to do during the buy phase
	 		  onBuy - function that describes what to do when first purchased
	 		  onTrashed - function that describes what to do when it's trashed
	 		  onReaction - function that describes action during the reaction phase
	 		  onScore - function that describes what to do when scoring

	 * Description: for each potential action, make a dummy action if the action
	 * 				doesn't exist. Else set the action object
	 */
	Card.prototype.makeAction = function(onAction, onCoin, onBuy, onTrashed, onReaction, onScore){
		//Set default function for parameters if they are undefined
		onAction = makeActionHelper(onAction, this.hasAction);
		onCoin = makeActionHelper(onCoin, this.hasCoin);
		onBuy = makeActionHelper(onBuy, this.hasBuy);
		onTrashed = makeActionHelper(onTrashed, this.hasTrashed);
		onReaction = makeActionHelper(onReaction, this.hasReaction);
		onScore = makeActionHelper(onScore, this.hasScore);
		//set the action object
		return {
					"onAction": onAction,
					"onCoin": onCoin,
					"onBuy": onBuy,
					"onTrashed": onTrashed,
					"onReaction": onReaction,
					"onScore": onScore
				};
	};

	Card.prototype.removeInfoText = function(){
		var el = document.getElementById('popup');
		el.style.display = "none";
	}

	Card.prototype.addInfoText = function(event, cardDescript){
		var el, x, y;
		el = document.getElementById('popup');
		if (window.event) {
			x = window.event.clientX + document.documentElement.scrollLeft
				+ document.body.scrollLeft;
			y = window.event.clientY + document.documentElement.scrollTop +
				+ document.body.scrollTop;
		}
		else {
			x = event.clientX + window.scrollX;
			y = event.clientY + window.scrollY;
		}
		x -= 2; 
		y -= 2;
		y = y+15
		el.style.left = x + "px";
		el.style.top = y + "px";
		el.style.display = "block";
		el.style.position = "absolute";
		document.getElementById('popup-text').innerHTML = cardDescript;	
		$("#popup-close").click(this.removeInfoText);
	}

	Card.prototype.onObjectBuy = function(event, cardObj){
		if (board.possPhases[board.currentPhase] === "buy"){
			var player = board.players[board.turn];
			if (player.canBuyCard(cardObj)){
				player.incrementBuys(-1);
				player.incrementCoins(-cardObj.cost);
				player.usedCards.push(cardObj.name);
			}
			if (player.numBuys <= 0){
				board.endTurn();
			}
		}
	}

	Card.prototype.onObjectPlay = function(event, cardObj, index){
		if (board.possPhases[board.currentPhase] === "action"){
			var player = board.players[board.turn];
			if (cardObj.hasAction && player.numActions > 0){
				cardObj.actions["onAction"](player);
				player.removeCardFromHand(cardObj.name, index, 
								  		  player.usedCards);
			}
		}
		console.log(this.name);
	}

	Card.prototype.onObjectPlayEnd = function(){
		var player = board.players[board.turn];
		if (player.numActions <= 0){
			board.endAction();
		}
	}

	Card.prototype.onObjectCoin = function(event, cardObj, index){
		if (board.possPhases[board.currentPhase] === "buy"){
			var player = board.players[board.turn];
			if (cardObj.hasCoin){
				cardObj.actions["onCoin"](player);
				player.removeCardFromHand(cardObj.name, index, 
										  player.usedCards);
			}
		}
	}


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

	var kingdomCardList = ["cellar", "chapel", "moat", "chancellor",
						   "village", "woodcutter", "workshop", "bureaucrat",
						   "feast", "gardens", "militia", "moneylender", 
						   "remodel","smithy", "spy", "thief", "throne room",
						   "council room", "festival", "laboratory", "library",
						   "market", "mine", "witch", "adventurer"];
	var supplyCardList = ["copper", "silver", "gold", "estate", "duchy", 
						  "province", "curse"];

	var createCardObject = {
		"curse": makeCurse,
		"estate": makeEstate,
		"duchy": makeDuchy,
		"province": makeProvince,
		"copper": makeCopper,
		"silver": makeSilver,
		"gold": makeGold,
		"cellar": makeCellar,
		"chapel": makeChapel,
		"moat": makeMoat,
		"chancellor": makeChancellor,
		"village": makeVillage,
		"woodcutter": makeWoodcutter,
		"workshop": makeWorkshop,
		"bureaucrat": makeBureaucrat,
		"feast": makeFeast,
		"gardens": makeGardens,
		"militia": makeMilitia,
		"moneylender": makeMoneylender,
		"remodel": makeRemodel,
		"smithy": makeSmithy,
		"spy": makeSpy,
		"thief": makeThief,
		"throne room": makeThroneRoom,
		"council room": makeCouncilRoom,
		"festival": makeFestival,
		"laboratory": makeLaboratory,
		"library": makeLibrary,
		"market": makeMarket,
		"mine": makeMine,
		"witch": makeWitch,
		"adventurer": makeAdventurer
	};

	//////////////Descriptions of Cards//////////////////

	function makeCurse(){
		var curseDescription = "-1 victory point";
		var curse = new Card("curse", 0, curseDescription);
		curse.numberPerGame = {"2": 10, "3": 20, "4": 30, "5": 40, "6": 50};
		curse.actions["onScore"] = function(player){
										player.incrementScore(-1);
										return true;
									};
		curse.hasScore = true;
		return curse;
	}

	///Estate///
	//Figure out how to remove cards after they are used
	function makeEstate(){
		var estateDescription = "1 victory point";
		var estate = new Card("estate", 2, estateDescription);
		estate.numberPerGame = {"2": 8, "3": 12, "4": 12, "5": 12, "6": 12};
		estate.actions["onScore"] = function(player){
										player.incrementScore(1);
										return true;
									};
		estate.hasScore = true;
		return estate;
	}

	function makeDuchy(){
		var duchyDescription = "3 victory points";
		var duchy = new Card("duchy", 5, duchyDescription);
		duchy.numberPerGame = {"2": 8, "3": 12, "4": 12, "5": 12, "6": 12};
		duchy.actions["onScore"] = function(player){
										player.incrementScore(3);
										return true;
									};
		duchy.hasScore = true;
		return duchy;
	}

	function makeProvince(){
		var provinceDescription = "6 victory points";
		var province = new Card("province", 8, estateDescription);
		province.numberPerGame = {"2": 8, "3": 12, "4": 12, "5": 15, "6": 18};
		province.actions["onScore"] = function(player){
										player.incrementScore(6);
										return true;
									};
		province.hasScore = true;
		return province;
	}

	function makeCopper(){
		var copperDescription = "1 coin";
		var copper = new Card("copper", 0, copperDescription);
		copper.numberPerGame = {"2": 46, "3": 39, "4": 32, "5": 85, "6": 78};
		copper.actions["onCoin"] = function(player){
									   		player.incrementCoins(1);
									   		return true;
									   };
		copper.hasCoin = true;
		copper.isBasicCoin = true;
		return copper;
	}

	//CHANGE NUMBER OF SILVERS AND GOLDS
	function makeSilver(){
		var silverDescription = "2 coins";
		var silver = new Card("silver", 3, silverDescription);
		silver.numberPerGame = {"2": 40, "3": 40, "4": 40, "5": 80, "6": 80};
		silver.actions["onCoin"] = function(player){
									   		player.incrementCoins(2);
									   		return true;
									   };
		silver.hasCoin = true;
		silver.isBasicCoin = true;
		return silver;
	}

	function makeGold(){
		var goldDescription = "3 coins";
		var gold = new Card("gold", 6, goldDescription);
		gold.numberPerGame = {"2": 30, "3": 30, "4": 30, "5": 60, "6": 60};
		gold.actions["onCoin"] = function(player){
									   		player.incrementCoins(3);
									   		return true;
									   };
		gold.hasCoin = true;
		gold.isBasicCoin = true;
		return gold;
	}

	function makeCellar(){
		var cellarDescription = "+1 action. Discard any number of cards. Plus one "+
						"card per card discarded";
		var cellar = new Card("cellar", 2, cellarDescription);
		cellar.actions["onAction"] = cellarOnAction;

		//cardList elem = [name, id]
		function onDoneButton(cardList){
			var player = board.players[board.turn];
			var hand = player.hand;
			var numToDraw = 0;
			for (var i=0; i<cardList.length; i++){
				var cardName = cardList[i][0];
				var cardId = cardList[i][1];
				if (player.removeCardFromHand(cardName, cardId, player.discard)){
					numToDraw += 1;
				}
			}
			player.draw(numToDraw, true);
			cellar.onObjectPlayEnd();
		}

		function isValidSolution(cardList){
			return true;
		}

		function cellarOnAction(player){
			if (player.numActions > 0){
				player.addSelectCardsDom(isValidSolution, onDoneButton);
				return true;
			}
		}

		cellar.hasAction = true;
		return cellar;
	}

	function makeChapel(){
		var chapelDescription = "trash up to four cards from your hand";
		var chapel = new Card("chapel", 2, chapelDescription);
		chapel.actions["onAction"] = chapelOnAction;

		//cardList elem = [name, id]
		function onDoneButton(cardList){
			var player = board.players[board.turn];
			var hand = player.hand;
			var numToDraw = 0;
			for (var i=0; i<cardList.length; i++){
				var cardName = cardList[i][0];
				var cardId = cardList[i][1];
				player.removeCardFromHand(cardName, cardId, board.trash);
			}
			chapel.onObjectPlayEnd();
		}

		function isValidSolution(cardList){
			var len = cardList.length;
			return (len <= 4);
		}

		function chapelOnAction(player){
			if (player.numActions > 0){
				player.incrementActions(-1);
				player.addSelectCardsDom(isValidSolution, onDoneButton);
				return true;
			}
		}

		chapel.hasAction = true;
		return chapel;
	}

	function makeMoat(){
		var moatDescription = "+2 cards. When another player plays an attack card, "+
					  "you may reveal this card from your hand. If you do, "+
					  "you are unaffected by that Attack";
		var moat = new Card("moat", 2, moatDescription);
		return moat;
	}

	function makeChancellor(){
		var chancellorDescription = "+2 coin. You may immediately put your deck "+
							"into your discard pile";
		var chancellor = new Card("chancellor", 3, chancellorDescription);
		return chancellor;
	}
		
	function makeVillage(){
		var villageDescription = "+1 card +2 actions";
		var village = new Card("village", 3, villageDescription);
		village.actions["onAction"] = villageOnAction;

		function villageOnAction(player){
			if (player.numActions > 0){
				player.incrementActions(1);
				player.draw(1, true);
				village.onObjectPlayEnd();
			}
		}

		village.hasAction = true;
		return village;
	}

	function makeWoodcutter(){
		var woodcutterDescription = "+1 buy +2 coin";
		var woodcutter = new Card("woodcutter", 3, woodcutterDescription);
		woodcutter.actions["onAction"] = villageOnAction;

		function villageOnAction(player){
			if (player.numActions > 0){
				player.incrementActions(-1);
				player.incrementBuys(1);
				player.incrementCoins(2);
				woodcutter.onObjectPlayEnd();
			}
		}

		woodcutter.hasAction = true;
		return woodcutter;
	}

	function makeWorkshop(){
		var workshopDescription = "gain a card costing up to 4";
		var workshop = new Card("workshop", 3, workshopDescription);
		return workshop;
	}
		
	function makeBureaucrat(){
		var bureaucratDescription = "Gain a silver card; put it on top of your "+
							"deck. Each other player reveals a victory " + 
							"card from his hand and puts it on his deck "+
							"(or reveals a hand with no victory cards)";
		var bureaucrat = new Card("bureaucrat", 4, bureaucratDescription);
		return bureaucrat;
	}

	function makeFeast(){
		var feastDescription = "trash this card. Gain a card costing up to 5 coins";
		var feast = new Card("feast", 4, feastDescription);
		return feast;
	}

	function makeGardens(){
		var gardensDescription = "worth one victory point for every 10 cards in "+
								 "your deck (rounded down)";
		var gardens = new Card("gardens", 4, gardensDescription);
		gardens.numberPerGame = {"2": 8, "3": 12, "4": 12, "5": 12, "6": 12};
		gardens.actions["onScore"] = gardensOnScore;
		
		function gardensOnScore(player){
			var numCards = player.hand.length+player.discard.length+
						   player.deck.length+player.usedCards.length;
			var score = Math.floor(numCards/10);
			player.incrementScore(score);
			return true;
		};

		gardens.hasScore = true;
		return gardens;
	}

	function makeMilitia(){
		var militiaDescription = "+ 2 coins. Each other player discards down to "+
								 "3 cards in his hand";
		var militia = new Card("militia", 4, militiaDescription);
		return militia;
	}

	function makeMoneylender(){
		var moneylenderDescription = "Trash a copper from your hand. If you do "+
									 "+3 coins";
		var moneylender = new Card("moneylender", 4, moneylenderDescription);
		return moneylender;
	}

	function makeRemodel(){
		var remodelDescription = "Trash a card from your hand. Gain a card "+
								 "costing up to two more than the trashed card";
		var remodel = new Card("remodel", 4, remodelDescription);
		return remodel;
	}

	function makeSmithy(){
		var smithyDescription = "+ 3 cards";
		var smithy = new Card("smithy", 4, smithyDescription);

		smithy.actions["onAction"] = smithyOnAction;

		function smithyOnAction(player){
			if (player.numActions > 0){
				player.draw(3, true);
				player.incrementActions(-1);
				smithy.onObjectPlayEnd();
				return true;
			}
		}

		smithy.hasAction = true;
		return smithy;
	}

	function makeSpy(){
		var spyDescription = "+1 card, +1 action. Each player (including you) "+
							 "reveals the top card of his deck and either "+
							 "discards it or puts it back, your choice";
		var spy = new Card("spy", 4, spyDescription);
		return spy;
	}

	function makeThief(){
		var thiefDescription = "Each other player reveals the top two cards. "+
							   "If they revealed any treasure cards, they "+
							   "trash one of them that you choose. You may "+
							   "gain any or all of these trashed cards. "+
							   "they discard the other revealed cards."
		var thief = new Card("thief", 4, thiefDescription);
		return thief;
	}

	function makeThroneRoom(){
		var throneRoomDescription = "Choose an action card in your hand. "+
									"Play it twice.";
		var throneRoom = new Card("throne room", 4, throneRoomDescription);
		return throneRoom;
	}

	function makeCouncilRoom(){
		var councilRoomDescription = "+4 cards, +1 buy. Each other player "+
									 "draws a card";
		var councilRoom = new Card("council room", 5, councilRoomDescription);
		return councilRoom;
	}

	function makeFestival(){
		var festivalDescription = "+2 actions, +1 buy, +2 coins";
		var festival = new Card("festival", 5, festivalDescription);
		festival.actions["onAction"] = festivalOnAction;

		function festivalOnAction(player){
			if (player.numActions > 0){
				player.incrementActions(1);
				player.incrementBuys(1);
				player.incrementCoins(2);
				festival.onObjectPlayEnd();
				return true;
			}
		}

		festival.hasAction = true;

		return festival;
	}

	function makeLaboratory(){
		var laboratoryDescription = "+2 cards, +1 action";
		var laboratory = new Card("laboratory", 5, laboratoryDescription);
		laboratory.actions["onAction"] = laboratoryOnAction;

		function laboratoryOnAction(player){
			if (player.numActions > 0){
				player.draw(2, true);
				laboratory.onObjectPlayEnd();
				return true;
			}
		}

		laboratory.hasAction = true;
		

		return laboratory;
	}

	function makeLibrary(){
		var libraryDescription = "Draw until you have 7 cards in hand. "+
								 "You may set aside any action cards drawn "+
								 "in this way as you drawn them; discard the "+
								 "set aside cards after you finish drawing";
		var library = new Card("library", 5, libraryDescription);
		return library;
	}

	function makeMarket(){
		var marketDescription = "+1 card\n"+"+1 action\n"+"+1 buy"+"+1 coin\n";
		var market = new Card("market", 5, marketDescription);
		market.actions["onAction"] = marketOnAction;

		function marketOnAction(player){
			if (player.numActions > 0){
				player.draw(1, true);
				player.incrementBuys(1);
				player.incrementCoins(1);
				market.onObjectPlayEnd();
				return true;
			}
		}

		market.hasAction = true;
		return market;
	}

	function makeMine(){
		var mineDescription = "Trash a treasure card from your hand. Gain "+
							  "a treasure card costing up to 3 coins more; "+
							  "put it into your hand";
		var mine = new Card("mine", 5, mineDescription);
		return mine;
	}

	function makeWitch(){
		var witchDescription = "+2 cards. Each other player gains a curse card.";
		var witch = new Card("witch", 5, witchDescription);
		return witch;
	}

	function makeAdventurer(){
		var adventurerDescription = "Reveal cards from your deck until you "+
									"reveal two treasure cards. Put those "+
									"treasure cards into your hand and discard "+
									"the other revealed cards";
		var adventurer = new Card("adventurer", 5, adventurerDescription);
		return adventurer;
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
		this.numCoins = 0;
	}

	Player.prototype.removeCardFromHand = function(card, index, endLoc){
		for (var i=0; i<this.hand.length; i++){
			if (this.hand[i] === card){
				this.hand.splice(i,1);
				$("#"+index).remove();
				endLoc.push(card);
				return true;
			}
		}
		return false;
	}

	Player.prototype.incrementActions = function(num){
		this.numActions += num;
		var numActionsStr = $("#num-actions").html();
		var numActions = parseInt(numActionsStr)+num;
		$("#num-actions").html(numActions.toString());
	}

	Player.prototype.incrementBuys = function(num){
		this.numBuys += num;
		var numBuysStr = $("#num-buys").html();
		var numBuys = parseInt(numBuysStr)+num;
		$("#num-buys").html(numBuys.toString());
	}

	Player.prototype.incrementCoins = function(num){
		this.numCoins += num;
		var numCoinsStr = $("#num-coins").html();
		var numCoins = parseInt(numCoinsStr)+num;
		$("#num-coins").html(numCoins.toString());
	}

	Player.prototype.incrementScore = function(num){
		this.score += num;
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
	Player.prototype.draw = function(numOfCards, drawDom){
		var deckLen = this.deck.length;
		//If enough cards just draw numOfCards
		if (deckLen >= numOfCards){
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
			newCards = newCards.concat(popMultiple(this.deck, restOfCards));
		}
		this.hand = this.hand.concat(newCards);	
		if (!(drawDom === false)){
			this.makePlayerDom();
		}
	};

/*
	//Doesn't handle reactions currently
	Player.prototype.playCard = function(card, board){
		if (board.players[board.turn] != this.name){
			return;
		}
		else{
			if (board.possPhases[board.currentPhase] === "action" && card.hasAction){
				card.actions[onAction](this);
				//If card has an attack you want to let other players play
				//Reactions. Do this later.
				if (card.hasAttack){

				}
			}
			else if (board.currentPhase === "buy" && card.hasCoin){
				card.actions[onAction](this);
			}
		}
	}
*/

	Player.prototype.trashCard = function(card, board){
		if (card.hasTrashed){
			card.actions[onAction](this);
		}
	}

	Player.prototype.canBuyCard = function(cardToBuy){
		if (cardToBuy.cost <= this.numCoins && this.numBuys > 0){
			return true;
		}
		else if (cardToBuy.cost > this.numCoins && this.numBuys <= 0){
/*			return "Sorry. "+cardToBuy.name+" costs "+cardToBuy.cost.toString()+
				   "coins but you only have "+this.numCoins.toString()+
				   "coins. You also don't have enough buys."
*/
			return false;
		}
		else if (cardToBuy.cost > this.numCoins){
/*			return "Sorry. "+cardToBuy.name+" costs "+cardToBuy.cost.toString()+
				   "coins but you only have "+this.numCoins.toString()+
				   "coins."
*/
			return false;
		}
		else{
/*
			return "Sorry. You don't have enough buys."
*/
			return false;
		}
	}

	function onObjectPlayHandler(cardDiv, cardObj, index){
		cardDiv.addEventListener("click", function(e){
			if ($("#"+index).hasClass("active-card")){
				cardObj.onObjectPlay(e, cardObj, index);
			}
		});
	}

	function onObjectCoinHandler(cardDiv, cardObj, index){
		cardDiv.addEventListener("click", function(e){
			cardObj.onObjectCoin(e, cardObj, index);
		})
	}

	Player.prototype.makePlayerDom = function(){
		var playerHand = this.hand;
		var playerDeck = this.discard;
		var playerUsedCards = this.usedCards;
		var playerDeck = this.deck;
		$("#hand").empty();
//		var cardFrag = document.createDocumentFragment();
		for (var i=0; i<playerHand.length; i++){
			var cardDiv = "<div class='hand-card active-card' id='"+i+"'><p>"+
						  playerHand[i]+"</p></div>";
			$("#hand").append(cardDiv);
			var cardDescript = getCurrCardObj(playerHand[i]);
			if (cardDescript != null){
				var cardObj = cardDescript["object"];
				var cardDiv = document.getElementById(i);
				if (cardObj.hasAction){
					onObjectPlayHandler(cardDiv, cardObj, i);					
				}
				if (cardObj.hasCoin){
					onObjectCoinHandler(cardDiv, cardObj, i);
					if (cardObj.isBasicCoin){
						$("#"+i.toString()).addClass("basic-coin");
					}
				}
			}
//			$("#"+card).hover(cardObj.addInfoText, cardObj.removeInfoText);
		}
		$("#num-actions").html(this.numActions.toString());
		$("#num-buys").html(this.numBuys.toString());
		$("#num-coins").html(this.numCoins.toString());

	}

	function getParagraphText(elem){
		return elem.substring(elem.lastIndexOf("<p>")+3,
					   		  elem.lastIndexOf("</p>"));
	}

	Player.prototype.addSelectCardsDom = function(checkValidSol, onDoneButton){
		$(".hand-card").removeClass("active-card");
		var checkBox = $('<input type="checkbox" class="hand-checkbox">');
		var doneButton = $('<button id="done-button">Done</button>');
		$(".hand-card").append(checkBox);
		$("#card-effects").append(doneButton);
		$("#done-button").click(function(event){
			var allChecked = $( "input:checked" );
			var checkedCards = [];
			for(var i=0; i<allChecked.length; i++){
				var checkedDiv = allChecked[i].parentNode;
				var elem = checkedDiv.innerHTML;
				elem = getParagraphText(elem);
				checkedCards.push([elem, checkedDiv.id]);
			}
			if (checkValidSol(checkedCards)){
				onDoneButton(checkedCards);
				$("#done-button").remove();
				$(".hand-checkbox").remove();
				$(".hand-card").addClass("active-card");
			}			
		});
	}

	Player.prototype.resetSelf = function(){
		this.discard = this.discard.concat(this.usedCards, this.hand);
		this.usedCards = [];
		this.hand = [];
		this.numBuys = 1;
		this.numActions = 1;
		this.numCoins = 0;
		this.draw(5, false);
	}

	////////////////////////////////////////////////////////////////////////

	function Board(startingPlayer, players){
		this.turn = startingPlayer;
		this.players = players;
		this.possPhases = ["action", "buy"];
		this.currentPhase = 0;
		//Generates an array of 10 cards
		this.kingdomCards = this.generateCards(25);
		this.supplyCards = this.createSupplyCards();
		this.trash = [];
	}

	Board.prototype.endAction = function(){
		board.currentPhase = 1;
		$("#play-coins").show();
		$("#end-action").html("End Turn");
		$("#end-action").prop("id", "end-turn");
	}

	//THIS IS THE CLEANUP PHASE
	Board.prototype.endTurn = function(){
		var currPlayer = board.players[board.turn];
		currPlayer.resetSelf();
		board.currentPhase = 0;
		board.turn = (board.turn+1)%board.players.length;
		board.players[board.turn].makePlayerDom();
		$("#play-coins").hide();
		$("#end-turn").html("End Action");
		$("#end-turn").prop("id", "end-action");
		$("#player-name").html(board.players[board.turn].name);
		printDecks(board.players[board.turn]);
	}

	function getCurrCardObj(card){
		if (board.kingdomCards[card] != undefined && 
			board.kingdomCards[card] != null){
			return board.kingdomCards[card];
		}
		else if (board.supplyCards[card] != undefined && 
			board.supplyCards[card] != null)
			return board.supplyCards[card];
		else{
			return null;
		}
	}

	Board.prototype.playCoinsButton = function(event){
		var currPlayer = board.players[this.turn];
		var currCardDescript;
		var currCardObj;
		var currCard;
		var newHand = [];
		for (var i=0; i<currPlayer.hand.length; i++){
			currCard = currPlayer.hand[i]
			currCardDescript = getCurrCardObj(currCard);
			if (currCardDescript != null){
				currCardObj = currCardDescript["object"];
				if (currCardObj.isBasicCoin){
					currCardObj.actions["onCoin"](currPlayer);
					currPlayer.usedCards.push(currCard);
				}
				else{
					newHand.push(currCard);
				}
			}
		}
		$(".basic-coin").remove();
		currPlayer.hand = newHand;
		return;
	}

	function makeCardInfo(cardName, numPlayers){
		var cardObject = createCardObject[cardName]();
		return {
			"object": cardObject,
			"numberLeft": cardObject.numberPerGame[numPlayers.toString()]
		};
	}


	/**
	 * 
	 */
	Board.prototype.generateCards = function(numCardsToGenerate){
		var cardNames = kingdomCardList.slice(0,numCardsToGenerate);
		var cardObject = {};
		for (var i=0; i<cardNames.length; i++){
			cardObject[cardNames[i]] = makeCardInfo(cardNames[i], 
									   this.players.length);
		}
		return cardObject;
	}

	Board.prototype.createSupplyCards = function(){
		var cardObject = {};
		for (var i=0; i<supplyCardList.length; i++){
			cardObject[supplyCardList[i]] = makeCardInfo(supplyCardList[i], 
									   this.players.length);
		}
		return cardObject;
	}

	function startDrawingGame(playerArray, dominionBoard){
		for (var i=0; i<playerArray.length; i++){
			var playerDiv = "<div id="+playerArray[i].name+">"+playerArray[i].name+"</div>";
		}
		for (var i=0; i<dominionBoard.kingdomCards.length; i++){
			$("#dominion-board").append(dominionBoard.kingdomCards[i]);
		}
	}

	function gameNotOver(board){
		var emptyPiles = 0;
		for (var card in board.kingdomCards){
			if (board.kingdomCards.hasOwnProperty(card)){
				if (kingdomCards[card]["numberLeft"] === 0){
					emptyPiles += 1;
				}
			}
		}
		for (var card in board.supplyCards){
			if (board.kingdomCards.hasOwnProperty(card)){
				if (board.supplyCards[card]["numberLeft"] === 0){
					emptyPiles += 1;
				}
			}
		}
		if (board.supplyCards["province"]["numberLeft"] === 0 ||
			emptyPiles >= 3){
			return false;
		}
		else{
			return true;
		}
	}

	function runGame(objArray){
		var player = objArray[0];
		var board = objArray[1];
		while(gameNotOver(board)){

		}
	}

	function createAddInfoTextHandler(cardDiv, cardObj){
		cardDiv.addEventListener("contextmenu", (function(e){
								 cardObj.addInfoText(e, cardObj.description)}));
	}

	function createOnObjectBuyHandler(cardDiv, cardObj){
		cardDiv.addEventListener("click", (function(e){
								 cardObj.onObjectBuy(e, cardObj)
		}));
	}

	function makeBoardDom(){
		var playerName = board.players[board.turn].name;
		$("#player-name").text(playerName);
		var kingdomCards = board.kingdomCards;
		var supplyCards = board.supplyCards;
//		var cardFrag = document.createDocumentFragment();
		for (var supplyCard in board.supplyCards){
			var cardDiv = "<div class='card' id='"+supplyCard+"'><p>"+supplyCard+
						  "</p></div>";
			$("#supply-cards").append(cardDiv);
			var cardObj = board.supplyCards[supplyCard]["object"];
			var cardDiv = document.getElementById(supplyCard);
			createOnObjectBuyHandler(cardDiv, cardObj);
			createAddInfoTextHandler(cardDiv, cardObj);
			$("#"+supplyCard).bind("contextmenu", function(e){
				return false;
			});
			//$("#"+supplyCard).hover(cardObj.addInfoText, cardObj.removeInfoText);
		}
		for (var kingdomCard in board.kingdomCards){
			var cardDiv = "<div class='card' id='"+kingdomCard+"'><p>"+kingdomCard+
						  "</p></div>";
			$("#kingdom-cards").append(cardDiv);
			var cardObj = board.kingdomCards[kingdomCard]["object"];
			var cardDiv = document.getElementById(kingdomCard);
			createOnObjectBuyHandler(cardDiv, cardObj);
			createAddInfoTextHandler(cardDiv, cardObj);
			$("#"+kingdomCard).bind("contextmenu", function(e){
				return false;
			});
			//$("#"+kingdomCard).hover(cardObj.addInfoText, cardObj.removeInfoText);

		}		
	}

	//Players will be an array of players... Dunno how that will be generated
	function init(playerNames){
		var playerArray = [];
		//Needs to be changed for dark ages
		//Add the players to the array
		for (var i=0; i<playerNames.length; i++){
			var startDeck = ["estate", "estate", "estate", "copper", "copper",
							 "copper", "copper", "copper", "copper", "copper"]
			startDeck = ["cellar", "chapel", "moat", "chancellor",
						   "village", "woodcutter", "workshop", "bureaucrat",
						   "feast", "gardens", "militia", "moneylender", 
						   "remodel","smithy", "spy", "thief", "throne room",
						   "council room", "festival", "laboratory", "library",
						   "market", "mine", "witch", "adventurer"];
			var newPlayer = new Player(playerNames[i], startDeck);
			newPlayer.shuffleDeck();
			newPlayer.draw(5, false);
			playerArray.push(newPlayer);
		}
		var playCoins = document.getElementById("play-coins");
		playCoins.addEventListener("click", function(e){
				board.playCoinsButton(e)});
		$("#play-coins").hide();
		$("body").on('click', '#end-action, #end-turn', function(e){
    		switch (this.id) {
       	 		case 'end-turn':
            		board.endTurn();
            		break;
        		case 'end-action':
            		board.endAction();
            		break;
   			}
   		});
   		var board = new Board(0, playerArray);
		return board;	
	}

	window.onload = function(){
	//	var dominionModule = angular.module('dominionApp', []);
		board = init(["player 1"]);
		makeBoardDom();
		board.players[board.turn].makePlayerDom();
//		var finalObjArray = runGame(objArray);
//		var winner = calculateScore(finalObjArray);
//		displayWinner(winner);

	}
	/////////////////////////////////////////////////////////////////////////

})();