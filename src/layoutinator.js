'use strict';


var transformProp;
navigator.sayswho= (function(){
	var N = navigator.appName, ua = navigator.userAgent, tem;
	var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem = ua.match(/version\/([\.\d]+)/i))!= null) M[2] = tem[1];
	M = M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
	M = M[0];
	if(M == "Chrome") { transformProp = "webkitTransform"; }
	if(M == "Firefox") { transformProp = "transform"; }
	if(M == "Safari") { transformProp = "webkitTransform"; }
	if(M == "MSIE") { transformProp = "ms"; }
})();


/**
 * Sets 
 * @param {Dom Element} parenetEl
 * @param {Boolean} isCol
 * @param {Number} limit
 * @param {Number} margin
 * @param {Number} minWidth
 * @param {Number} minHeight
 *
 * isCol is wether you want a vertical layout or horizontal
 * limit limits how many elements fit into a column or row.
 * column limit is by pixels, row limit is by number of elements.
 * 
 */

var process = function(parentEl, isCol, limit, margin, minWidth, minHeight) {

	//step for row means move to the right of the previous element.
	//shift for row means start a new row.

	//step for column means move below previous element.
	//shift for columne means start new column.

	var prevEl;
	var largest = 0;
	var children = parentEl.children;
	var prevTempMaxStep = 0;
	var tempMaxStep = 0;
	var maxShift = 0;
	var shiftValue = 0;
	var elementCount = 0;

	for (var i = 0; i < children.length; i++) {
		var child = children[i];


		if(child.className.indexOf('floatable') == -1) {
			//skip over elemants that are not containers like titles, and images
				//but add the height of the element you are skipping
			if(isCol) {
				prevTempMaxStep += 30;
			}else {
				maxShift += 40;
			}
			continue;
		}

		if(child.className.indexOf('sorting') != -1) {
			continue;
		}

		// you need to set the innermost elements style in html and not in css.
		// css is not processed yet so we inline it on the div when it is created above.
		// the parent containers height and width get set at the end of this function.

		var currentHeight = parse(child.style.height) + margin.top;
		var currentWidth = parse(child.style.width) + margin.left;


		//decide by how many pixels you are going to place the next element to the 
		//right of, or below the previous element.
		var stepInc = isCol ? currentHeight : currentWidth;

		//decide by how many pixels you need to move to start new row or column.
		var shiftInc = isCol ? currentWidth : currentHeight;

		//keeps track of step so you know when to start new row or column.
		var stepValue = 0;

		elementCount++;

		if (prevEl) {
			stepValue = prevEl.stepValue + prevEl.stepInc;

			if ((isCol && stepValue + stepInc > limit - 20) || (!isCol && elementCount > limit)) {
				//start new row or column.
				//reset step to 0
				shiftValue = prevEl.shiftValue + largest;		
				stepValue = 0;

				//keep track of largest element in case the children are not all the same 
				//width or height so you can set the parent height to fit the tallest or
				//widest element.
				largest = 0;
				elementCount = 1;

				//keep track of total shift and step so you know what height to make the
				//parent element
				maxShift += shiftInc;
				tempMaxStep = (prevTempMaxStep > tempMaxStep) ? prevTempMaxStep : tempMaxStep;
				prevTempMaxStep = 0;
			}

			prevTempMaxStep += stepInc;

			var transform = getTransform(stepValue, shiftValue, isCol, margin);
			child.style[transformProp] = transform;

		}else {
			//first element is always {x: 0, y: 0} because the trasform is based off of
			//wherever the parent element is.

			var transform = getTransform(stepValue, shiftValue, isCol, margin);
			child.style[transformProp] = transform;

			prevTempMaxStep += (isCol) ? currentHeight : currentWidth;
			maxShift += (isCol) ? currentWidth : currentHeight;
		}

		//keep previous element in memory so you don't have to look it up all the time.
		prevEl = {
			shiftValue: shiftValue, 
			stepValue: stepValue, 
			shiftInc: shiftInc, 
			stepInc: stepInc}

		largest = (largest > shiftInc) ? largest : shiftInc;
		tempMaxStep = (prevTempMaxStep > tempMaxStep) ? prevTempMaxStep : tempMaxStep;

	}

	//calculate parents new width and height.
	if (isCol) {
		tempMaxStep = (minHeight > tempMaxStep) ? minHeight : tempMaxStep;
		maxShift = (minWidth > maxShift) ? minWidth : maxShift;
	}
	else {
		tempMaxStep = (minWidth > tempMaxStep) ? minWidth : tempMaxStep;
		maxShift = (minHeight > maxShift) ? minHeight : maxShift;
	}
	var newParentSize = calcNewParentSize(maxShift, tempMaxStep, isCol);
	if(parentEl.id != 'world') {
	parentEl.style.height = newParentSize.h;
	parentEl.style.width = newParentSize.w;
	}

}


//helper function to abstract the difference between row or column.
function calcNewParentSize(maxShift, maxStep, isCol) {
	var WH;
	if (isCol) {
		WH = {w: maxShift + 'px', h: maxStep + 'px'}
	} else {
		WH = {w: maxStep + 'px', h: maxShift + 'px'}
	}

	return WH;
}

//helper function to remove px and turn it into a number.
function parse(string) {
	return parseInt(string.slice(0,-2), 10);
}

//helper function to abstract the difference between row or column.
function getTransform(step, shift, isCol, margin) {
	if (isCol) {
		return 'translate3d(' + shift + 'px, ' + step + 'px, 0)';
	}	else {
		return 'translate3d(' + step + 'px, ' + shift + 'px, 0)';
	}
}
