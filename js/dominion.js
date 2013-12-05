(function(){

	//////////////Debugging Functions//////////////////

	/**
	 * Description: debugging function that prints the player's decks
	 */
	function printDecks(player){
		console.log("player deck: "+player.deck);
		console.log("player hand: "+player.hand);
		console.log("player used: "+player.usedCards);
		console.log("player discard: "+player.discard);
	}

    //////////////General Functions/////////////////
    
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

	/**
	 *  Input: card name
	 *  Description: look for the card in the kingdom or supply cards
	 *               and return the description if it is there
	 */
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

	/**
	 * Input: text to write to log
	 * Description: writes text to the game log
	 */
	function writeToLog(text){
		$("#game-info p").append(text+"<br/>");
		$("#game-info").scrollTop($('#game-info')[0].scrollHeight);
	}

	/**
	 *  Input: event, card id
	 *  Description: toggle the class that changes the color of the card
	 *               highlight
	 */
	function highlightCard(e, id){
		$("#"+id).toggleClass("checked");
	}

	/**
	 *  Input: card div, card object, card location
	 *  Description: creates an event handler for card cardDiv that calls
	 *               onObjectPlay
	 */
	function onObjectPlayHandler(cardDiv, cardObj, index){
		$("#"+cardDiv.id).click(function(e){
			if ($("#"+index).hasClass("active-card")){
				cardObj.onObjectPlay(e, cardObj, index);
			}
		});
	}

	/**
	 *  Input: card div, card object, card location
	 *  Description: creates an event handler for card cardDiv that calls
	 *               onObjectCoin
	 */
	function onObjectCoinHandler(cardDiv, cardObj, index){
		$("#"+cardDiv.id).click(function(e){
			cardObj.onObjectCoin(e, cardObj, index);
		})
	}

	/** 
	 *  Input: cardDiv, card Object
	 *  Description: create an event listener for right clicks for the popup
	 */
	function createAddInfoTextHandler(cardDiv, cardObj){
		cardDiv.addEventListener("contextmenu", (function(e){
								 cardObj.addInfoText(e, cardObj)}));
	}

	/**
	 *  Input: cardDiv, card Object
	 *  Description: create an event lister that calls onObjectBuy
	 */
	function createOnObjectBuyHandler(cardDiv, cardObj){
		$("#"+cardDiv.id).click(function(e){
								 cardObj.onObjectBuy(e, cardObj)
		});
	}


	/**
	 *  Input: card name, numPlayers
	 *  Description: creates and object with key=card name, 
	 *  value=[card object, number of cards left of object in game]
	 */
	function makeCardInfo(cardName, numPlayers){
		var cardObject = createCardObject[cardName]();
		return {
			"object": cardObject,
			"numberLeft": cardObject.numberPerGame[numPlayers.toString()]
		};
	}

	/** 
	 *  Input: arr, numToPop
	 *  Description:  pop multiple things off arr and return the
	 *                list of popped items
	 */
	function popMultiple(arr, numToPop){
		var popArr = [];
		if (arr.length < numToPop){
			numToPop = arr.length;
		}
		for (var i=0; i<numToPop; i++){
			var tempPop = arr.pop();
			popArr.push(tempPop);
		}
		return popArr;
	}

	//////////////Global Variables//////////////////

	//Contains board data
	var board;

	//Contains all possible kingdom cards
	var kingdomCardList = ["cellar", "chapel", "chancellor",
						   "village", "woodcutter", "workshop", 
						   "feast", "gardens", "moneylender", 
						   "smithy", "festival", "laboratory", 
						   "market", "adventurer"];
	//Contains all possible supply cards
	var supplyCardList = ["copper", "silver", "gold", "estate", "duchy", 
						  "province", "curse"];

	//Contains all the functions that create cards
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
	//Because not all cards need to exist every game, card making functions
	//are stored in the card list object until they need to be used to make 
	//cards//

	/**
	 * Description: creates the curse object
	 * Output: curse object
	 */
	function makeCurse(){
		var curseDescription = "-1 victory point";
		var curse = new Card("curse", 0, curseDescription, "img/curse.jpg");
		curse.numberPerGame = {"1": 10, "2": 10, "3": 20, 
							   "4": 30, "5": 40, "6": 50};
		//During the scoring phase, subtract one from player score
		curse.actions["onScore"] = function(player){
										player.incrementScore(-1);
										return true;
									};
		curse.hasScore = true;
		return curse;
	}

	/**
	 * Description: creates the estate object
	 * Output: estate object
	 */
	function makeEstate(){
		var estateDescription = "1 victory point";
		var estate = new Card("estate", 2, estateDescription, 
							  "img/estate.jpg");
		estate.numberPerGame = {"1": 8, "2": 8, "3": 12, 
							    "4": 12, "5": 12, "6": 12};
		//During the scoring phase, add one to the player's score
		estate.actions["onScore"] = function(player){
										player.incrementScore(1);
										return true;
									};
		estate.hasScore = true;
		return estate;
	}

	/**
	 * Description: creates the duchy object
	 * Output: estate object
	 */
	function makeDuchy(){
		var duchyDescription = "3 victory points";
		var duchy = new Card("duchy", 5, duchyDescription, "img/duchy.jpg");
		duchy.numberPerGame = {"1": 8, "2": 8, "3": 12, 
		   					   "4": 12, "5": 12, "6": 12};
		//During the scoring phase, add three to the player's score
		duchy.actions["onScore"] = function(player){
										player.incrementScore(3);
										return true;
									};
		duchy.hasScore = true;
		return duchy;
	}

	/**
	 * Description: creates the province object
	 * Output: province object
	 */
	function makeProvince(){
		var provinceDescription = "6 victory points";
		var province = new Card("province", 8, provinceDescription, 
							    "img/province.jpg");
		province.numberPerGame = {"1": 2, "2": 2, "3": 3, 	
								  "4": 12, "5": 15, "6": 18};
		//During the scoring phase, add 6 to the player's score
		province.actions["onScore"] = function(player){
										player.incrementScore(6);
										return true;
									};
		province.hasScore = true;
		return province;
	}

	/**
	 * Description: creates the copper object
	 * Output copper object
	 */
	function makeCopper(){
		var copperDescription = "1 coin";
		var copper = new Card("copper", 0, copperDescription, "img/copper.jpg");
		copper.numberPerGame = {"1": 53, "2": 46, "3": 39, 
							    "4": 32, "5": 85, "6": 78};
		//Add one to total number of coins during buy phase
		copper.actions["onCoin"] = function(player){
									   		player.incrementCoins(1);
									   		return true;
									   };
		copper.hasCoin = true;
		copper.isBasicCoin = true;
		return copper;
	}

	/**
	 * Description: creates the silver object
	 * Output: silver object
	 */
	function makeSilver(){
		var silverDescription = "2 coins";
		var silver = new Card("silver", 3, silverDescription, "img/silver.jpg");
		silver.numberPerGame = {"1": 40, "2": 40, "3": 40, 
								"4": 40, "5": 80, "6": 80};
		//Adds 2 to the amount of coins during buy phase
		silver.actions["onCoin"] = function(player){
									   		player.incrementCoins(2);
									   		return true;
									   };
		silver.hasCoin = true;
		silver.isBasicCoin = true;
		return silver;
	}

	/**
	 * Description: creates the gold object
	 ** Ouput: gold object
	 */
	function makeGold(){
		var goldDescription = "3 coins";
		var gold = new Card("gold", 6, goldDescription, "img/gold.jpg");
		gold.numberPerGame = {"1": 30, "2": 30, "3": 30, 
							  "4": 30, "5": 60, "6": 60};
		//Adds 3 to the amount of coins during buy phase
		gold.actions["onCoin"] = function(player){
									   		player.incrementCoins(3);
									   		return true;
									   };
		gold.hasCoin = true;
		gold.isBasicCoin = true;
		return gold;
	}

	/**
	 * Description: creates the cellar object
	 * Ouput: cellar object
	 */
	function makeCellar(){
		var cellarDescription = "+1 action. Discard any number of cards. "+
								"Plus one card per card discarded";
		var cellar = new Card("cellar", 2, cellarDescription, "img/cellar.jpg");
		cellar.actions["onAction"] = cellarOnAction;

		//Input: player object, [card name, card id]
		//Description: takes the selected cards and discards them, swapping
		//			   them for new ones
		function onDoneButton(player, cardList){
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
			//Write this to log
			writeToLog(" ... discarding "+cardList.length+" cards");
			writeToLog(" ... drawing "+cardList.length+" cards");
			cellar.onObjectPlayEnd();
		}

		//Solutions are always valid so return true always
		function isValidSolution(player, cardList){
			return true;
		}

		//Input: player object
		//When cellar is played add an action and allow users to select multiple
		//cards and call onDoneButton on selected cards
		function cellarOnAction(player){
			var question = "Choose the cards you want to discard";
			player.incrementActions(1);
			player.selectMultipleCards(question, isValidSolution, onDoneButton);
			return true;
		}

		cellar.hasAction = true;
		return cellar;
	}

	/**
	 * Description: creates the chapel object
	 */
	function makeChapel(){
		var chapelDescription = "trash up to four cards from your hand";
		var chapel = new Card("chapel", 2, chapelDescription, "img/chapel.jpg");
		chapel.actions["onAction"] = chapelOnAction;

		//Input: player object, [card name, card id]
		//Description: takes the selected cards and trashes them
		function onDoneButton(player, cardList){
			var player = board.players[board.turn];
			var hand = player.hand;
			var numToDraw = 0;
			for (var i=0; i<cardList.length; i++){
				var cardName = cardList[i][0];
				var cardId = cardList[i][1];
				player.removeCardFromHand(cardName, cardId, board.trash);
			}
			//writes action to the log
			writeToLog(" ... trashing "+cardList.length+" cards");
			chapel.onObjectPlayEnd();
		}

		//Input: player object, list of selected cards
		//Makes sure that no mroe than 4 cards are chosen
		function isValidSolution(player, cardList){
			var len = cardList.length;
			return (len <= 4);
		}

		//Input: player
		//Select multiple cards and call onDoneAction on them
		function chapelOnAction(player){
			var question = "Choose up to 4 cards to trash";
			player.selectMultipleCards(question, isValidSolution, onDoneButton);
			return true;
		}

		chapel.hasAction = true;
		return chapel;
	}

	/**
	 * Description: creates the moat object
	 */
	function makeMoat(){
		var moatDescription = "+2 cards. When another player plays an attack "+
					 		  "card, you may reveal this card from your hand. "+
					 		  "If you do, you are unaffected by that Attack";
		var moat = new Card("moat", 2, moatDescription, "img/moat.jpg");
		return moat;
	}

	/**
	 * Description: creates the chancellor object
	 */
	function makeChancellor(){
		var chancellorDescription = "+2 coin. You may immediately put your "+
									"deck into your discard pile";
		var chancellor = new Card("chancellor", 3, chancellorDescription, 
								  "img/chancellor.jpg");
		chancellor.actions["onAction"] = chancellorOnAction;

		//Input: player
		//Description: if they user says yes, discard his deck
		function onYes(player){
			player.discard = player.discard.concat(player.deck);
			player.deck = [];
			writeToLog("... putting deck in discard");
			chancellor.onObjectPlayEnd();
		}

		//Input: player
		//Description: if the user says no, end turn
		function onNo(player){
			chancellor.onObjectPlayEnd();		
		}

		//Input: player
		//Description: gives the player 2 coins and the option to discard his
		//hand
		function chancellorOnAction(player){
			player.incrementCoins(2);
			var question = "Do you want to put your deck into your discard?"
			player.giveYesNoChoice(question, onYes, onNo);
		}

		chancellor.hasAction = true;
		return chancellor;
	}
		
	/**
	 * Description: creates the village object
	 */
	function makeVillage(){
		var villageDescription = "+1 card +2 actions";
		var village = new Card("village", 3, villageDescription, 
							   "img/village.jpg");
		village.actions["onAction"] = villageOnAction;

		//Input: player object
		//Description: gives user 2 actions and one card
		function villageOnAction(player){
			player.incrementActions(2);
			writeToLog("... gaining 2 actions");
			var numDrawn = player.draw(1, true);
			if(numDrawn === 1){writeToLog("... drawing 1 card")}
			village.onObjectPlayEnd();
		}

		village.hasAction = true;
		return village;
	}

	/**
	 * Description: creates the woodcutter object
	 */
	function makeWoodcutter(){
		var woodcutterDescription = "+1 buy +$2";
		var woodcutter = new Card("woodcutter", 3, woodcutterDescription, 
								  "img/woodcutter.jpg");
		woodcutter.actions["onAction"] = woodcutterOnAction;

		//Input: player object
		//Description: gives user one buy and 2 coins
		function woodcutterOnAction(player){
			player.incrementBuys(1);
			player.incrementCoins(2);
			woodcutter.onObjectPlayEnd();
			writeToLog("... gaining 1 buy");
			writeToLog("... gaining $2");
		}

		woodcutter.hasAction = true;
		return woodcutter;
	}

	/**
	 * Description: creates the workshop object
	 */
	function makeWorkshop(){
		var workshopDescription = "gain a card costing up to 4";
		var workshop = new Card("workshop", 3, workshopDescription, "img/workshop.jpg");
		workshop.actions["onAction"] = workshopOnAction;

		//Input: player object, [card name, card id]
		//Description: Take the chosen card and gain a copy of it
		function onCardClick(player, cardList){
			var cardObj = getCurrCardObj(cardList[0])["object"];
			cardObj.onObjectGain(player, cardObj);
			writeToLog("... gaining a "+cardList[0]);
			workshop.onObjectPlayEnd();
		}

		//Input: player object, [card name, card id]
		//Description: Makes sure the chosen card costs no more than 4
		function isValidSolution(player, cardList){
			var cardObjInfo = getCurrCardObj(cardList[0]);
			if (!(cardObjInfo === null)){
				var cardObj = cardObjInfo["object"];
				if (cardObjInfo["numberLeft"] > 0 && cardObj.cost <= 4){
					return true;
				}
				return false;
			}
		}

		//Input: player object
		//Description: allow user to select a card up to $4 and gain it
		function workshopOnAction(player){
			var question = "Choose a card costing 4 or less to gain";
			player.selectSingleCard(question, isValidSolution,
										  onCardClick, "card");
			return true;
		}

		workshop.hasAction = true;
		return workshop;
	}
	
	/**
	 * Description: creates the bureaucrat object
	 */
	function makeBureaucrat(){
		var bureaucratDescription = "Gain a silver card; put it on top of "+
									"your deck. Each other player reveals a "+
									"victory card from his hand and puts it "+
									"on his deck (or reveals a hand with no "+
									"victory cards)";
		var bureaucrat = new Card("bureaucrat", 4, bureaucratDescription, 
								  "img/bureaucrat.jpg");
		return bureaucrat;
	}

	/**
	 * Description: creates the feast object
	 */
	function makeFeast(){
		var feastDescription = "trash this card. Gain a card costing up to "+
							   "5 coins";
		var feast = new Card("feast", 4, feastDescription, "img/feast.jpg");
		feast.actions["onAction"] = feastOnAction;

		//Input: player object, [card name, card id]
		//Description: gain the card object with card name
		function onCardClick(player, cardList){
			var cardObj = getCurrCardObj(cardList[0])["object"];
			cardObj.onObjectGain(player, cardObj);
			writeToLog("... gaining a "+cardList[0]);
			feast.onObjectPlayEnd();
		}

		//Input: player ojbect, [card name, card id]
		//Description: gain a card with cost less than or equal to 5
		function isValidSolution(player, cardList){
			var cardObjInfo = getCurrCardObj(cardList[0]);
			if (!(cardObjInfo === null)){
				var cardObj = cardObjInfo["object"];
				if (cardObjInfo["numberLeft"] > 0 && cardObj.cost <= 5){
					return true;
				}
			}
			return false;
		}

		//Input: player object
		//Description: trash a feast and choose a card to gain of at most $5
		function feastOnAction(player){
			var question = "Choose a card that costs up to 5";
			for (var i=0; i<player.usedCards.length; i++){
				if(player.usedCards[i] === "feast"){
					player.usedCards.splice(i,1);
					break;
				}
			}
			player.selectSingleCard(question, isValidSolution,
										  onCardClick, "card");
			return true;
		}

		feast.hasAction = true;
		return feast;
	}

	/**
	 * Description: creates the gardens object
	 */
	function makeGardens(){
		var gardensDescription = "worth one victory point for every 10 cards "+
								 "in your deck (rounded down)";
		var gardens = new Card("gardens", 4, gardensDescription, 
							   "img/gardens.jpg");
		gardens.numberPerGame = {"1": 8, "2": 8, "3": 12, 
								 "4": 12, "5": 12, "6": 12};
		gardens.actions["onScore"] = gardensOnScore;
		
		//Input: player
		//Description: when calculating the player's score, worth one point
		//for every 10 cards rounded down in hand
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

	/**
	 * Description: creates the bureaucrat object
	 */
	function makeMilitia(){
		var militiaDescription = "+ 2 coins. Each other player discards down "+
								 "to 3 cards in his hand";
		var militia = new Card("militia", 4, militiaDescription, 
							   "img/militia.jpg");
		return militia;
	}

	/**
	 * Description: creates the moneylender object
	 */
	function makeMoneylender(){
		var moneylenderDescription = "Trash a copper from your hand. If you "+
									 "do, +$3";
		var moneylender = new Card("moneylender", 4, moneylenderDescription, 
								   "img/moneylender.jpg");
		moneylender.actions["onAction"] = moneylenderOnAction;

		//Input: player object, [card name, card id]
		//Description: Makes sure the card selected is a copper
		function isValidSolution(player, cardInfo){
			if (cardInfo[0] === "copper"){
				return true;
			}
			else{
				return false;
			}
		}

		//Input: player object, [card name, card id]
		//Description: Trash a card and gain $3
		function onCardClick(player, cardInfo){
			player.removeCardFromHand(cardInfo[0], cardInfo[1], board.trash);
			player.incrementCoins(3);
			writeToLog("... trashing a copper");
			writeToLog("... gaining $3");
			moneylender.onObjectPlayEnd();
		}

		//Input: player
		//Description: Choose a card to trash and if it's a copper
		//get $3
		function moneylenderOnAction(player){
			var question = "Trash a copper from your hand";
			player.selectSingleCard(question, isValidSolution,
										  onCardClick, "hand-card");
			return true;
		}

		moneylender.hasAction = true;
		return moneylender;
	}

	function makeRemodel(){
		var remodelDescription = "Trash a card from your hand. Gain a card "+
								 "costing up to two more than the trashed card";
		var remodel = new Card("remodel", 4, remodelDescription, 
							   "img/remodel.jpg");
		return remodel;
	}

	/**
	 * Description: creates the smith object
	 */
	function makeSmithy(){
		var smithyDescription = "+ 3 cards";
		var smithy = new Card("smithy", 4, smithyDescription, "img/smithy.jpg");

		smithy.actions["onAction"] = smithyOnAction;

		//Input: player object
		//Description: player draw three cards
		function smithyOnAction(player){
			var numDrawn = player.draw(3, true);
			if (numDrawn === 1) {writeToLog("... drawing 1 card");}
			if (numDrawn > 1) {writeToLog("... drawing "+numDrawn+" cards");}
			smithy.onObjectPlayEnd();
			return true;
		}

		smithy.hasAction = true;
		return smithy;
	}

	/**
	 * Description: creates the spy object
	 */
	function makeSpy(){
		var spyDescription = "+1 card, +1 action. Each player (including you) "+
							 "reveals the top card of his deck and either "+
							 "discards it or puts it back, your choice";
		var spy = new Card("spy", 4, spyDescription, "img/spy.jpg");
		return spy;
	}

	/**
	 * Description: creates the thief object
	 */
	function makeThief(){
		var thiefDescription = "Each other player reveals the top two cards. "+
							   "If they revealed any treasure cards, they "+
							   "trash one of them that you choose. You may "+
							   "gain any or all of these trashed cards. "+
							   "they discard the other revealed cards."
		var thief = new Card("thief", 4, thiefDescription, "img/thief.jpg");
		return thief;
	}

	/**
	 * Description: creates the throne room object
	 */
	function makeThroneRoom(){
		var throneRoomDescription = "Choose an action card in your hand. "+
									"Play it twice.";
		var throneRoom = new Card("throne room", 4, throneRoomDescription, 
								  "img/throneroom.jpg");
		return throneRoom;
	}

	/**
	 * Description: creates the council room object
	 */
	function makeCouncilRoom(){
		var councilRoomDescription = "+4 cards, +1 buy. Each other player "+
									 "draws a card";
		var councilRoom = new Card("council room", 5, councilRoomDescription, 
								   "img/councilroom.jpg");
		return councilRoom;
	}

	/**
	 * Description: creates the feastival object
	 */
	function makeFestival(){
		var festivalDescription = "+2 actions, +1 buy, +2 coins";
		var festival = new Card("festival", 5, festivalDescription, 
						        "img/festival.jpg");
		festival.actions["onAction"] = festivalOnAction;

		//Input: player object
		//Description: adds 2 actions, 1 buy, and $2 to player
		function festivalOnAction(player){
			player.incrementActions(2);
			writeToLog("... gaining 2 actions");
			player.incrementBuys(1);
			writeToLog("... gaining 1 buy");
			player.incrementCoins(2);
			writeToLog("... gaining $2");
			festival.onObjectPlayEnd();
			return true;
		}

		festival.hasAction = true;
		return festival;
	}

	/**
	 * Description: creates the laboratory object
	 */
	function makeLaboratory(){
		var laboratoryDescription = "+2 cards, +1 action";
		var laboratory = new Card("laboratory", 5, laboratoryDescription, 
								  "img/laboratory.jpg");
		laboratory.actions["onAction"] = laboratoryOnAction;

		//Input: player object
		//Description: gain one action and 2 cards
		function laboratoryOnAction(player){
			player.incrementActions(1);
			writeToLog("... gaining 1 action");
			var numDraw = player.draw(2, true);
			if (numDraw === 1){writeToLog("... drawing 1 card")};
			if (numDraw > 1){writeToLog("... drawing "+numDraw+" cards")};
			laboratory.onObjectPlayEnd();
			return true;
		}

		laboratory.hasAction = true;
		return laboratory;
	}

	/**
	 * Description: creates the library object
	 */
	function makeLibrary(){
		var libraryDescription = "Draw until you have 7 cards in hand. "+
								 "You may set aside any action cards drawn "+
								 "in this way as you drawn them; discard the "+
								 "set aside cards after you finish drawing";
		var library = new Card("library", 5, libraryDescription, 
							   "img/library.jpg");
		return library;
	}

	/**
	 * Description: creates the market object
	 */
	function makeMarket(){
		var marketDescription = "+1 card\n"+"+1 action\n"+"+1 buy"+"+1 coin\n";
		var market = new Card("market", 5, marketDescription, 
							  "img/market.jpg");
		market.actions["onAction"] = marketOnAction;

		//Input: player object
		//Description: player gains one action, one buy, and one coin
		function marketOnAction(player){
			var numDraw = player.draw(1, true);
			if (numDraw === 1){writeToLog("... drawing 1 card")};
			player.incrementActions(1);
			writeToLog("... gaining 1 action");
			player.incrementBuys(1);
			writeToLog("... gaining 1 buy");
			player.incrementCoins(1);
			writeToLog("... gaining 1 coin");
			market.onObjectPlayEnd();
			return true;
		}

		market.hasAction = true;
		return market;
	}

	/**
	 * Description: creates the mine object
	 */
	function makeMine(){
		var mineDescription = "Trash a treasure card from your hand. Gain "+
							  "a treasure card costing up to 3 coins more; "+
							  "put it into your hand";
		var mine = new Card("mine", 5, mineDescription, "img/mine.jpg");
		return mine;
	}

	/**
	 * Description: creates the witch object
	 */
	function makeWitch(){
		var witchDescription = "+2 cards. Each other player gains a curse card.";
		var witch = new Card("witch", 5, witchDescription, "img/witch.jpg");
		return witch;
	}

	/**
	 * Description: creates the adventurer object
	 */
	function makeAdventurer(){
		var adventurerDescription = "Reveal cards from your deck until you "+
									"reveal two treasure cards. Put those "+
									"treasure cards into your hand and discard "+
									"the other revealed cards";
		var adventurer = new Card("adventurer", 5, adventurerDescription, 
								  "img/adventurer.jpg");
		adventurer.actions["onAction"] = adventurerOnAction;

		//Input: player object
		//Description: draw cards until you get two treasures in had	
		function adventurerOnAction(player){
			var count = 0;
			var revealedCards = [];
			//while two treasure have yet to be drawn
			while(count < 2){
				var newCardList = player.pullFromDeck(1);
				//If there are no more cards then stop searching
				if (newCardList.length === 0){
					break;
				}
				var newCard = newCardList[0];
				var cardObj = getCurrCardObj(newCard)["object"];
				//If object is a coin then add that to the hand
				//and count it as a coin card
				if (cardObj.hasCoin){
					writeToLog("... drawing a "+cardObj.name);
					count+=1;
					player.hand.push(newCard);
					player.makePlayerDom();
				}
				else{
					//Add it to the cards already looked at
					revealedCards.push(newCard);
				}
			}
			//Put everything you've drawn in the discard
			player.discard = player.discard.concat(revealedCards);
			adventurer.onObjectPlayEnd();
		}

		adventurer.hasAction = true;
		return adventurer;
	}


	////////////Dominion Card Object///////////////

	/**
	 * Dominion Card Object
	 *
	 * name: Name of card (String)
	 * cost: cost of the card (Number)
	 * imgSrc: the image source for the card
	 * description: the description of what the card does
	 * numberPerGame: how many number of a particular card is in a game
	 *                depending on how many people are player
	 * actions: Type of actions the card can have (Action object)
	 			If action doesn't exist put as null
	 * hasAction: has an action
	 * hasCoin: is a treasure card
	 * hasBuy: has a function that triggers when card is gained/bought
	 * hasTrashed: has a function that triggers when card is trashed
	 * hasReaction: has a function that triggers when player attacked
	 * hasAttack: has a function that attacks other players
	 * hasScore: has a function that gives poiints when scoring
	 * isBasicCoin: is one of: copper/silver/gold/platinum
	 */
	 function Card(name, cost, description, imgSrc){
	 	if (name === undefined) {name = ""};
	 	if (cost === undefined) {cost = 0};
	 	if (imgSrc === undefined) {imgSrc = ""};
	 	this.name = name;
	 	this.cost = cost;
	 	this.description = description;
	 	this.imgSrc = imgSrc;
	 	//Number of cards on the board at the start of the game
	 	this.numberPerGame = {"1": 10, "2": 10, "3": 10, 
	 						  "4": 10, "5": 10, "6": 10};
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
	Card.prototype.makeAction = function(onAction, onCoin, onBuy, 
										 onTrashed, onReaction, onScore){
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

	/**
	 *  Description: removes the card description popup by hiding it in DOM
	 */
	Card.prototype.removeInfoText = function(){
		var el = document.getElementById('popup');
		el.style.display = "none";
	}

	/**
	 *  Description: Create div with current card's name, cost, number left,
	 *               and descriptions
	 */
	Card.prototype.generateInfoText = function(){
		var name = this.name;
		var cost = this.cost;
		var numLeft = getCurrCardObj(name)["numberLeft"];
		var descript = this.description;
		var text = "<p><b>Name:</b> "+name+"<br>"+"<b>Cost:</b> "+cost+"<br>"+
				   "<b>Number Left:</b> "+numLeft+"<br>"+"<b>Description:</b> "+
				   descript+"</p>";
		return text;
	}

	/**
	 *  Input: event, card object
	 *  Description: add input text to the DOM
	 */
	Card.prototype.addInfoText = function(event, cardObj){
		var el = document.getElementById('popup');
		var x;
		var y;
		//Calculate the current mouse position;
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
		//Shift the popup to a nice location that doesn't block cards
		x -= 2; 
		y -= 2;
		y = y+15
		el.style.left = x + "px";
		el.style.top = y + "px";
		el.style.display = "block";
		el.style.position = "absolute";
		//Add information about card to popup
		var infoText = cardObj.generateInfoText();
		document.getElementById('popup-text').innerHTML = infoText;	
		//When popup is clicked again hide it
		$("#popup").click(this.removeInfoText);
	}

	/**
	 *  Input: player object, card object
	 *  Description: Adjusts metadata (number cards left) and
	 *   			 gives player the gained object
	 */
	Card.prototype.onObjectGain = function(player, cardObj){
		var cardObjInfo = getCurrCardObj(cardObj.name);
		//If there's still that card left take one
		if (cardObjInfo["numberLeft"] > 0){
			cardObjInfo["numberLeft"] -= 1;
			player.discard.push(cardObj.name);
			//If there's no cards left gray it out
			if (cardObjInfo["numberLeft"]===0){
				$("#"+cardObj.name).css("color", "gray");
			}
			return true;
		}
		else{
			return false;
		}
	}

	/**
	 *  Input: player event, card object
	 *  Description: Does the action for when a player buys
	 *               a card
	 */
	Card.prototype.onObjectBuy = function(event, cardObj){
		//Check to make sure game is in the buy phase
		if (board.possPhases[board.currentPhase] === "buy"){
			var player = board.players[board.turn];
			//If player is allowed to buy the card let him but it and pay the
			//appropirate 1 buy X coins
			if (player.canBuyCard(cardObj)){
				if(this.onObjectGain(player, cardObj)){
					player.incrementBuys(-1);
					player.incrementCoins(-cardObj.cost);
					writeToLog(player.name + " buys 1 "+cardObj.name);
				}
			}
			//If the player can't buy anything else then endhis turn
			if (player.numBuys <= 0){
				board.endTurn();
			}
		}
	}

	/**
	 *  Input: player object, card object
	 *  Description: Does the action whenever a player plays a card
	 */
	Card.prototype.onObjectPlay = function(event, cardObj, index){
		//Check to make sure the game is in the action phase
		if (board.possPhases[board.currentPhase] === "action"){
			var player = board.players[board.turn];
			//If the card played has and action and player can play actions
			//take the card and play it
			if (cardObj.hasAction && player.numActions > 0){
				player.removeCardFromHand(cardObj.name, index, 
								  		  player.usedCards);
				if (player.numActions > 0){
					player.incrementActions(-1);
					writeToLog(player.name + " plays 1 "+cardObj.name);
					cardObj.actions["onAction"](player);
				}				
			}
		}
	}

	/**
	 *  Description: After the action is played check to see if
	 *               the user can play any actions or if they have anymore
	 *				 actions before ending their action phase
	 */
	Card.prototype.onObjectPlayEnd = function(){
		var player = board.players[board.turn];
		if (player.numActions <= 0 || player.noActionsInHand()){
			board.endAction();
		}
	}

	/**
	 *  Input: event card object, location of card in hand
	 *  Description: Plays a treasure piece and gains amount dictated
	 */
	Card.prototype.onObjectCoin = function(event, cardObj, index){
		//Check to make sure it's the buy phase
		if (board.possPhases[board.currentPhase] === "buy"){
			var player = board.players[board.turn];
			//If the card is a treasure play it
			if (cardObj.hasCoin){
				writeToLog(player.name + " plays 1 "+cardObj.name);
				cardObj.actions["onCoin"](player);
				player.removeCardFromHand(cardObj.name, index, 
										  player.usedCards);
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
	 * numCoins: how many coins a player still has
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

	/**
	 *  Description: returns true if the player has no actions in hand
	 *	             and false otherwise
	 */
	Player.prototype.noActionsInHand = function(){
		for (var i=0; i<this.hand.length; i++){
			var cardDescript = getCurrCardObj(this.hand[i]);
			var cardObj = cardDescript["object"];
			if (cardObj.hasAction){
				return false;
			}
		}
		return true;
	}

	/**
	 *  Input: card name, location of card in hand, where card should end up
	 *  Description: remove the card card in hand and put it in endLoc
	 */
	Player.prototype.removeCardFromHand = function(card, index, endLoc){
		for (var i=0; i<this.hand.length; i++){
			//If it's the correct card, remove it and put it in endLoc
			if (this.hand[i] === card){
				this.hand.splice(i,1);
				$("#"+index).remove();
				endLoc.push(card);
				return true;
			}
		}
		return false;
	}

	/**
	 *  Input: num
	 *  Description: give player num actions and adjust DOM accordingly
	 */
	Player.prototype.incrementActions = function(num){
		this.numActions += num;
		var numActionsStr = $("#num-actions").html();
		var numActions = parseInt(numActionsStr)+num;
		$("#num-actions").html(numActions.toString());
	}

	/**
	 *  Input: num
	 *  Description: give player num buys and adjust DOM accordingly
	 */
	Player.prototype.incrementBuys = function(num){
		this.numBuys += num;
		var numBuysStr = $("#num-buys").html();
		var numBuys = parseInt(numBuysStr)+num;
		$("#num-buys").html(numBuys.toString());
	}

	/**
	 *  Input: num
	 *  Description: give player num coins and adjust DOM accordingly
	 */
	Player.prototype.incrementCoins = function(num){
		this.numCoins += num;
		var numCoinsStr = $("#num-coins").html();
		var numCoins = parseInt(numCoinsStr)+num;
		$("#num-coins").html(numCoins.toString());
	}

	/**
	 *  Input: num
	 *  Description: increments player's score
	 */
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
	 *  Input: numOfCards
	 *  Description: draw numOfCards cards from the deck and return it
	 */
	Player.prototype.pullFromDeck = function(numOfCards){
		var deckLen = this.deck.length;
		var newCards = [];
		//If enough cards just draw numOfCards
		if (deckLen >= numOfCards){
			newCards = popMultiple(this.deck, numOfCards);
		}
		//If not enough then draw everything in deck, make discard the new deck
		//and draw some more
		else{
			var restOfCards = numOfCards - deckLen;
			newCards = this.deck;
			this.deck = this.discard;
			this.discard = [];
			this.shuffleDeck();
			newCards = newCards.concat(popMultiple(this.deck, restOfCards));
		}
		//return the cards drawn
		return newCards;		
	}

	/**
	 * Input: numOfCards, whether the dom should be redrawn
	 * Description: draws numberOfCards and then displays it if drawDom=true
	 */
	Player.prototype.draw = function(numOfCards, drawDom){
		var newCards = this.pullFromDeck(numOfCards);
		this.hand = this.hand.concat(newCards);	
		if (!(drawDom === false)){
			this.makePlayerDom();
		}
		return newCards.length;
	};

	/**
	 * Input: card object
	 * Description: checks to make sure you can afford the card and you
	 *              have enough buys
	 */
	Player.prototype.canBuyCard = function(cardToBuy){
		//Separated into cases in case of future error message insertion
		if (cardToBuy.cost <= this.numCoins && this.numBuys > 0){
			return true;
		}
		else if (cardToBuy.cost > this.numCoins && this.numBuys <= 0){
			return false;
		}
		else if (cardToBuy.cost > this.numCoins){
			return false;
		}
		else{
			return false;
		}
	}

	/**
	 *  Description: Handles the drawing and redrawing of the player's info;
	 *               hand and actions/buys/coins
	 */
	Player.prototype.makePlayerDom = function(){
		var playerHand = this.hand;
		var playerDeck = this.discard;
		var playerUsedCards = this.usedCards;
		var playerDeck = this.deck;
		//Empty the hand before redrawing to avoid pollution
		$("#hand").empty();
		//Draw every card in the player's hand
		for (var i=0; i<playerHand.length; i++){
			//Get the card description
			var cardDescript = getCurrCardObj(playerHand[i]);
			if (cardDescript != null){
				//Create a div for the card and add it to the hand
				var cardObj = cardDescript["object"];
				var cardDiv = "<div class='hand-card active-card' id='"+i+"'>"+
							  "<span id='"+cardObj.name+"'>"+
						  	  "<img src='"+cardObj.imgSrc+"' width='100' "+
						  	  "height='159' /></span></div>";
				$("#hand").append(cardDiv);
				//Create appropriate action and/or coin event handlers for card
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
		}
		//Record number of actions/buys/coins of player on screen
		$("#num-actions").html(this.numActions.toString());
		$("#num-buys").html(this.numBuys.toString());
		$("#num-coins").html(this.numCoins.toString());

	}

	/**
	 *  Input: question, onYes, onNo
	 *  Description: Draws the question and the Yes no response in dom
	 *               calls onYes if user chooses yes and onNo if chooses no
	 */
	Player.prototype.giveYesNoChoice = function(question, onYes, onNo){
		$(".hand-card").removeClass("active-card");
		var player = this;
		//Creates the question dom and the yes or no responses
		var questionDom = "<p id='question'>"+question+"&nbsp &nbsp &nbsp"+
						  " <b><span id='yes-question'>Yes</span></b> &nbsp"+
						  " <b><span id='no-question'>No</span></b></p>";
		$("#card-effects").append(questionDom);
		//Disables the end action button
		$("#end-action").prop("disabled",true);
		$("#end-action").removeClass("button-special");
		$("#end-action").addClass("button-disabled");
		//Called when user answers yes
		$("#yes-question").click(function(event){
			//Reset DOM back to before the question and call the onYes function
			$("#end-action").prop("disabled",false);
			$("#end-action").addClass("button-special");
			$("#end-action").removeClass("button-disabled");
			onYes(player);
			$("#yes-question").unbind("click");
			$("#no-question").unbind("click");
			$("#question").remove();
			$("#yes-question").remove();
			$("#no-question").remove();
			$(".hand-card").addClass("active-card");
		});
		//Called when user answers no
		$("#no-question").click(function(event){
			//Reset DOM back to before the question and call the onNo function
			$("#end-action").prop("disabled",false);
			$("#end-action").addClass("button-special");
			$("#end-action").removeClass("button-disabled");
			onNo(player);
			$("#yes-question").unbind("click");
			$("#no-question").unbind("click");
			$("#question").remove();
			$("#yes-question").remove();
			$("#no-question").remove();
			$(".hand-card").addClass("active-card");
		})
	}

	/**
	 *  Input: question, checkValidSo, onCardClick, cardsClass
	 *  Description: use cardsClass to determine whether player should choose
	 *               hand or supply cards; Draws the question and when player
	 *               chooses a card, if it's a valid selection, play onCardClick
	 */
	Player.prototype.selectSingleCard = function(question, checkValidSol, 
												 onCardClick, cardsClass){
		var player = this;
		//Create and draw the question
		var questionDom = "<p id='question'>"+question+"</p>";
		$("#card-effects").append(questionDom);
		//Disable clicking of cards and buttons until action complete
		$(".hand-card").removeClass("active-card");
		$("."+cardsClass).addClass("select-one-card");
		$("#end-action").prop("disabled",true);
		$("#end-action").removeClass("button-special");
		$("#end-action").addClass("button-disabled");
		//Function to call when a card is selected
		$(".select-one-card").click(function(event){
			var cardName = this.firstChild.id;
			var cardId = this.id;
			var cardInfo = [cardName, cardId];
			//Make sure solution is valid
			if (checkValidSol(player, cardInfo)){
				//Set board back to original state
				$("#end-action").prop("disabled",false);
				$("#end-action").addClass("button-special");
				$("#end-action").removeClass("button-disabled");
				//Execte the action with the card
				onCardClick(player, cardInfo);
				$(".select-one-card").unbind("click");
				$("."+cardsClass).removeClass("select-one-card");
				$("#question").remove();
				$(".hand-card").addClass("active-card");
			}
		})
	}

	/**
	 *  Input: question, checkValidSo, onDoneButton
	 *  Description: Draws the question and when player chooses multiple cards.
	 *               If they are valid selections, play onCardClick
	 */
	Player.prototype.selectMultipleCards = function(question, checkValidSol, 
												    onDoneButton){
		//Create and draw the question
		var questionDom = "<p id='question'>"+question+"</p>";
		$("#card-effects").append(questionDom);
		//Disable the clicking of cards until action complete
		$(".hand-card").removeClass("active-card");
		$(".hand-card").addClass("select-card");
		//If card is clicked highlight it
		$(".select-card").click(function(e){
									highlightCard(e, $(this).attr('id'))
								});
		//Done button is what signals that event is complete
		var doneButton = $('<button id="done-button">Done</button>');
		var player = this;
		$("#card-effects").append(doneButton);
		//Disable clicking of buttons until action complete
		$("#end-action").prop("disabled",true);
		$("#end-action").removeClass("button-special");
		$("#end-action").addClass("button-disabled");
		//Function that is called when done button selected
		$("#done-button").click(function(event){
			var allChecked = $(".checked");
			var checkedCards = [];
			//For each checked card make a new elem=[card name, card id]
			for(var i=0; i<allChecked.length; i++){
				var elem = allChecked[i].firstChild.id;
				checkedCards.push([elem, allChecked[i].id]);
			}
			//Check to see if solution is correct
			if (checkValidSol(player, checkedCards)){
				//Revert back to old state and call the function specified
				$(".select-card").unbind();
				$(".hand-card").removeClass("select-card");
				$("#end-action").prop("disabled",false);
				$("#end-action").addClass("button-special");
				$("#end-action").removeClass("button-disabled");
				onDoneButton(player, checkedCards);
				$("#done-button").unbind("click");
				$(".hand-card").removeClass("checked");
				$("#done-button").remove();
				$("#question").remove();
				$(".hand-card").addClass("active-card");
			}			
		});
	}

	/**
	 *  Description: reset state back to when turn first started
	 */
	Player.prototype.resetSelf = function(){
		this.discard = this.discard.concat(this.usedCards, this.hand);
		this.usedCards = [];
		this.hand = [];
		this.numBuys = 1;
		this.numActions = 1;
		this.numCoins = 0;
		this.draw(5, false);
	}

	////////////////////////////Board/////////////////////////////////

	/**
	 * Dominion Board Object:
	 * turn: index of person whose turn it is
	 * players: list of player's names
	 * possPhases: list of phases of game
	 * currentPhase: index of current phase of game
	 * kingdomCards: array of kingdom card descriptions in play this game
	 * supplyCards: array of the supply card descriptions in play this game
	 * trash: array of trashed items
	 */
	function Board(startingPlayer, players){
		this.turn = startingPlayer;
		this.players = players;
		this.possPhases = ["action", "buy"];
		this.currentPhase = 0;
		//Generates an array of 10 cards
		this.kingdomCards = this.generateCards(10);
		this.supplyCards = this.createSupplyCards();
		this.trash = [];
	}

	/**
	 *  Description: Toggle dom in response to the action ending
	 */
	Board.prototype.endAction = function(){
		board.currentPhase = 1;
		$("#play-coins").show();
		$("#end-game").show();
		$("#end-action").html("End Turn");
		$("#end-action").prop("id", "end-turn");
	}

	/**
	 *  Description: The cleanup phase of Dominion
	 */
	Board.prototype.endTurn = function(){
		var currPlayer = board.players[board.turn];
		//If the game is over figure out the winner is and end game
		if (board.gameOver()){
			board.calculateVictor();
		}
		else{
			//Reset state back to the action phase and change to next player
			currPlayer.resetSelf();
			board.currentPhase = 0;
			board.turn = (board.turn+1)%board.players.length;
			board.players[board.turn].makePlayerDom();
			$("#play-coins").hide();
			$("#end-game").hide();
			$("#end-turn").html("End Action");
			$("#end-turn").prop("id", "end-action");
			$("#player-name").html(board.players[board.turn].name);
			writeToLog("<br/>--- " + board.players[board.turn].name + "'s Turn ---");
			if (board.players[board.turn].noActionsInHand()){
				board.endAction();
			}
		}
	}

	/**
	 *  Input: event
	 *  Description: play all basic coins in hand
	 */
	Board.prototype.playCoinsButton = function(event){
		var currPlayer = board.players[this.turn];
		var currCardDescript;
		var currCardObj;
		var currCard;
		var newHand = [];
		var coins = {"copper": 0, "silver": 0, "gold": 0, "platinum": 0};
		//Go through the hand and find all basic coins
		for (var i=0; i<currPlayer.hand.length; i++){
			currCard = currPlayer.hand[i]
			currCardDescript = getCurrCardObj(currCard);
			if (currCardDescript != null){
				currCardObj = currCardDescript["object"];
				//If card is a basic coin then play it
				if (currCardObj.isBasicCoin){
					coins[currCardObj.name]+=1;
					currCardObj.actions["onCoin"](currPlayer);
					currPlayer.usedCards.push(currCard);
				}
				//Or else keep card in new hand
				else{
					newHand.push(currCard);
				}
			}
		}
		//Record how many of which coins were played
		for(var coin in coins){
			if(coins[coin] && coins[coin] > 0){
				writeToLog(currPlayer.name + " plays "+coins[coin]+" "+coin);
			} 
		}
		//Remove the basic coins from the DOM and change player's ahdn to
		//Reflect change
		$(".basic-coin").remove();
		currPlayer.hand = newHand;
		return;
	}

	/**
	 * Input: numCardsToGenerate
	 * Description: randomly generate numCardsToGenerate kingdom cards
	 */
	Board.prototype.generateCards = function(numCardsToGenerate){
		//Shuffle the kingdom card deck
		for (var i = kingdomCardList.length-1; i > 0; i--){
			var j = Math.floor(Math.random()*(i+1));
			var temp = kingdomCardList[j];
			kingdomCardList[j] = kingdomCardList[i];
			kingdomCardList[i] = temp;
		}
		//Draw the top 10 cards off the kingdom card deck
		var cardNames = kingdomCardList.slice(0,numCardsToGenerate);
		var cardObject = {};
		//create a cardDescription for each kingdom card
		for (var i=0; i<cardNames.length; i++){
			cardObject[cardNames[i]] = makeCardInfo(cardNames[i], 
									   this.players.length);
		}
		return cardObject;
	}

	/**
	 *  Description: create the supply cards
	 */
	Board.prototype.createSupplyCards = function(){
		var cardObject = {};
		//For each supply card, make a description for it
		for (var i=0; i<supplyCardList.length; i++){
			cardObject[supplyCardList[i]] = makeCardInfo(supplyCardList[i], 
									   this.players.length);
		}
		return cardObject;
	}

	/**
	 *  Description: checks to see if game is over; return true if game is
	 *               over and false otherwise
	 */
	Board.prototype.gameOver = function(){
		var emptyPiles = 0;
		//Count how many total empty piles between kingdom cards and
		//supply cards there are
		for (var card in board.kingdomCards){
			if (board.kingdomCards.hasOwnProperty(card)){
				if (board.kingdomCards[card]["numberLeft"] === 0){
					emptyPiles += 1;
				}
			}
		}
		for (var card in board.supplyCards){
			if (board.supplyCards.hasOwnProperty(card)){
				if (board.supplyCards[card]["numberLeft"] === 0){
					emptyPiles += 1;
				}
			}
		}
		//If there are no provinces or 3 piles are empty then the game is over
		if (board.supplyCards["province"]["numberLeft"] === 0 ||
			emptyPiles >= 3){
			return true;
		}
		else{
			return false;
		}
	}

	/**
	 *  Description: Figures out who won the game
	 */
	Board.prototype.calculateVictor = function(){
		var winners = [];
		var maxScore = -100;
		//For each player
		for (var i=0; i<board.players.length; i++){
			var player = board.players[i];
			var allCards = player.discard.concat(player.usedCards, player.hand,
												 player.deck);
			//Look at each card and figure out how many victory points he has
			for (var j=0; j<allCards.length; j++){
				var cardObj = getCurrCardObj(allCards[j])["object"];
				if (cardObj.hasScore){
					cardObj.actions["onScore"](player);
				}
			}
			//If player's score is greater than the current max make him the max
			if (player.score > maxScore){
				winners = [player.name];
				maxScore = player.score;
			}
			//If he is the same then it might be a tie so keep them both
			else if (player.score === maxScore){
				winners.push(player.name);
			}
		}
		//If there is more than one winner there might be a tie so check
		if (winners.length > 1){
			var currentIndex = board.turn;
			var superiorWinners = {};
			var count = 0;
			//Check to see if anyone took less turns than the others
			//(thewy would win in this case)
			for (var i=board.turn+1; i<board.players.length; i++){
				for (var j=0; j<winners.length; j++){
					if (board.players[i].name === winners[j]){
						superiorWinners[winners[j]] = true;
						count += 1;
					}
				}
			}
			//If there are people who took less turns then make them the winner
			if (count > 0){
				var keys = [];
				for(var k in superiorWinners){
					keys.push(k);
				} 
				winners = keys;
			}
		}

		//Make a string of winners to print
		var printWinner = ""
		for (var i=0; i<winners.length; i++){
			printWinner += winners[i]+", "
		}
		writeToLog("<br/> --- Winners: " + 
					printWinner.substring(0, printWinner.length-2)+" ---");
		//Go to the end screen because the game is finished
		endScreen(printWinner.substring(0, printWinner.length-2), winners.length);
	}

	///////////////State Manipulation Functions///////////////////

	/**
	 *  Input: winners string, number of winners
	 *  Description: draws the screen with the winners and the log of the game
	 */
	function endScreen(winners, numVictors){
		//Display the winners
		if (numVictors > 1){
			$("#end-screen #results").text("Tie between "+winners);
		}
		else{
			$("#end-screen #results").text("Winner is "+winners);
		}
		var logText = $("#game-info").html();
		//Display the final log
		$("#final-log").html("<p><b>Final Game Log</b></p>"+logText);
		$("#end-screen").show();
		$("#dominion-board").hide();
		//If players click play again they can restart the game
		$("#play-again").click(function(e){
			$("#end-screen").hide();
			$("#dominion-board").show();
			startScreen();
		});
	}

	/**
	 *  Description: draws the start screen where players can choose number
	 *               of players and their usernames
	 */
	function startScreen(){
		$("#start-screen").show();
		$("#player-num-list").show();
		$("#dominion-board").hide();
		//After player chooses number of players have him enter usernames
		$(".player-num").click(function(e){
			var numPlayers = parseInt(this.innerHTML);
			//Create input boxes for player to enter username
			for (var i=0; i<numPlayers; i++){
				var textbox = "<input class='username' type='text' "+
							  "value='player "+(i+1)+"'></input>";
				$("#start-screen").append(textbox);
			}
			//Create the start game button
			var button = "<span id='start-game' class='button'>"+
						 "<p>Start Game</p></span>";
			$("#start-screen").append(button);
			$(".player-num").unbind();
			$("#player-num-list").hide();
			//Starts the game when the start game button is clicked
			$("#start-game").click(function(e){
				var users = [];
				//Create list of players, resets screen, and starts game
				$("#start-screen .username").each(function(){
					users.push($(this).val());
				})
				$("#start-game").unbind();
				$(".username").remove();
				$("#start-game").remove();
				$("#start-screen").hide();
				$("#dominion-board").show();
				startGame(users);
			})
		})

	}

	/**
	 *  Descriptions: Draws the board DOM of kingdom/supply cards
	 */
	function makeBoardDom(){
		var playerName = board.players[board.turn].name;
		writeToLog("<br/>--- " + playerName + "'s Turn ---");
		var kingdomCards = board.kingdomCards;
		var supplyCards = board.supplyCards;
		//Empty the supply and kingdom cards so they don't clash with previous
		//ones
		$("#supply-cards").empty();
		$("#kingdom-cards").empty();
		//For all supply cards, create an image on the DOM for it
		for (var supplyCard in board.supplyCards){
			var cardObj = board.supplyCards[supplyCard]["object"];
			var cardDiv = "<div class='card' id='"+supplyCard+"'>"+
						  "<span id='"+cardObj.name+"'>"+
						   "<img src='"+cardObj.imgSrc+
						   "' width='80' height='127' /></span></div>";
			$("#supply-cards").append(cardDiv);
			var cardDiv = document.getElementById(supplyCard);
			//Add event handlers for supply card
			createOnObjectBuyHandler(cardDiv, cardObj);
			createAddInfoTextHandler(cardDiv, cardObj);
			//Suppress default right click menu
			$("#"+supplyCard).bind("contextmenu", function(e){
				return false;
			});
		}
		//For all kingdom cards, create an image on the DOM for it
		for (var kingdomCard in board.kingdomCards){
			var cardObj = board.kingdomCards[kingdomCard]["object"];
			var cardDiv = "<div class='card' id='"+kingdomCard+"'>"+
						  "<span id='"+cardObj.name+"'>"+
						  "<img src='"+cardObj.imgSrc+
						  "' width='100' height='159' /></span></div>";
			$("#kingdom-cards").append(cardDiv);
			var cardDiv = document.getElementById(kingdomCard);
			//Add event handlers for kingdom cards
			createOnObjectBuyHandler(cardDiv, cardObj);
			createAddInfoTextHandler(cardDiv, cardObj);
			//Suppress default right click menu
			$("#"+kingdomCard).bind("contextmenu", function(e){
				return false;
			});

		}
		//Initially if there are no action cards in hand then end action
		if (board.players[board.turn].noActionsInHand()){
			board.endAction();
		}
	}

	/**
	 *  Description: unbind all handlers so they don't clash with other handlers
	 *               later, like when restarting
	 */
	function unbindEventHandlers(){
		$(".card").unbind();
		$(".hand-card").unbind();
		$("#play-coins").unbind();
		$("#end-action").unbind();
		$("#end-turn").unbind();
		$("body").off();
		$("#popup-close").unbind();
		$("#play-again").unbind();
		$("#popup").unbind();
		$("#end-game").unbind();
	}

	/** 
	 *  Input:  playerNames list
	 *  Description:  Initiates the game given the list of player names
	 */
	function init(playerNames){
		var playerArray = [];
		unbindEventHandlers();
		//Initiates the players and create them
		for (var i=0; i<playerNames.length; i++){
			var startDeck = ["estate", "estate", "estate", "copper", "copper",
							 "copper", "copper", "copper", "copper", "copper"]
			var newPlayer = new Player(playerNames[i], startDeck);
			newPlayer.shuffleDeck();
			newPlayer.draw(5, false);
			playerArray.push(newPlayer);
		}
		//Creates an event handler for when players want to end 
		//the game abruptly
		$("#end-game").click(function(e){
			board.calculateVictor();
		})
		//Creates an event handler for players to play all their coins at once
		$("#play-coins").click(function(e){
				board.playCoinsButton(e)});
		//Start with these hidden and only show during buy phase
		$("#play-coins").hide();
		$("#end-game").hide();
		//Creates an event handler that calls endTurn or endAction depending
		//on the current phase of the turn
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
   		//Empties the game log
   		$("#game-info p").empty();
   		//Creates a new board
   		var board = new Board(0, playerArray);
		return board;	
	}

	/**
	 *  Input: list of users
	 *  Description: initialize the game, draw the board/player
	 */
	function startGame(users){
		board = init(users);
		makeBoardDom();
		board.players[board.turn].makePlayerDom();
	}

	//When window first loads, start the start screen
	window.onload = function(){
		startScreen();
	}
	/////////////////////////////////////////////////////////////////////////

})();