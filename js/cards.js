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

/**
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
*/