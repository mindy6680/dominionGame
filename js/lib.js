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