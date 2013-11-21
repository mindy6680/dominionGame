/*
 * Dominion Card Object
 * name: Name of card (String)
 * cost: cost of the card (Number)
 * cardType: What type of the card it is (Array)
 * actions: Type of actions the card can have (Action object)
 */

 function Card(name, cost, cardType, actions){
 	this.name = name;
 	this.cost = cost;
 	this.cardType = attributes;
 	this.actions = actions;
 }

Card.prototype.makeAction = makeAction;

/*
 * Note: Make all functions default to return or something like that
 */
function makeAction(onAct, onTreasure, onBuy, onTrashed){
	//Set default function for parameters if they are undefined
	if (onAct === null || onAct === undefined){
		onAct = function(){return};
	}
	if (onTreasure === null || onTreasure === undefined){
		onTreasure = function(){return};
	}
	if (onBuy === null || onBuy === undefined){
		onBuy = function(){return};
	}
	if (onTrashed === null || onTrashed === undefined){
		onTrashed = function(){return};
	}

	//create and return the action object
	return {
				"onAct": onAct,
				"onTreasure": onTreasure,
				"onBuy": onBuy,
				"onTrashed": onTrashed,
				"onReaction": onReaction
			};
}

function Player(){
	this.name=
}