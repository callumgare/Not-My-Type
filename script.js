var leafElms = []

// Made a few changes word levels
// A few references to House of Leaves
var queue = [document.body]
var node

while (node = queue.pop()) {
    for (var i = 0; i < node.childNodes.length; i++) {
		var subNode = node.childNodes[i];
		if (subNode.nodeType === Node.ELEMENT_NODE) {
			if (subNode.tagName === 'SCRIPT' || subNode.tagName === 'STYLE') continue;
			queue.push(subNode);
			if (subNode.childNodes.length === 1 && subNode.childNodes[0].nodeType === Node.TEXT_NODE) {
				leafElms.push(subNode)
			}

        } else if (subNode.nodeType === Node.TEXT_NODE) {
			var match
			if (match = subNode.textContent.match(/\w*House\w*|Haus|Maison/i)) {
				splitMatch(match, subNode).classList.add('nmt_house')
				i += 2
			}
			if (match = subNode.textContent.match(/Minotaur/i)) {
				splitMatch(match, subNode).classList.add('nmt_minotaur')
				i += 2
			}
			if (match = subNode.textContent.match(/r(?=n)/)) {
				splitMatch(match, subNode).classList.add('nmt_tracking-small')
				i += 2
			}
			if (match = subNode.textContent.match(/a(?= lot)/i)) {
				splitMatch(match, subNode).classList.add('nmt_tracking-very-small')
				i += 2
			}
			if (match = subNode.textContent.match(/a(?=lot)/i)) {
				splitMatch(match, subNode).classList.add('nmt_tracking-very-big')
				i += 2
			}
			// pick a random word with 7 or more letters and make each letter in that word progressively smaller
			// applies every 1 in 10 times
			match = subNode.textContent.match(/\w{7,}/g) 
			if(match && randomInt(1,10) === 10){
				match = match[randomInt(0, match.length-1)]
				//console.log(match)
				match = subNode.textContent.match(match)
				var elm = splitMatch(match, subNode)
				i += 2
				elm.classList.add('nmt_smaller')
				nestLetters(elm)
			}
        }
	}
}

// Make some paragraph level changes
// Add a touch of Arial
// And screw with the tracking
document.querySelectorAll('p').forEach(elm => {
	var startTarget = elm.innerText.length / 3
	var startNode;
	var charCount = 0;
	var charCount_prev = 0;
	var i;
	// find the sub node in which the first third of the paragraphs text ends
	for(i = 0; charCount < startTarget && i < elm.childNodes.length; i++) {
		var node = elm.childNodes[i];
		charCount_prev = charCount;
		charCount = charCount_prev + (node.innerText || node.textContent).length
	}
	// if said sub node is a text node split in two then remove all elements
	// after the split, add them to a new element then attach that element to
	// the root node. This new element can then be styled to our hearts content
	if(i > 0 && elm.childNodes[i-1].nodeType === Node.TEXT_NODE){
		var node = elm.childNodes[i-1];
		var secondNode = node.splitText(startTarget - charCount_prev) 
		var containerElement = document.createElement('span');
		containerElement.classList.add('nmt_arial')
		while(i < elm.childNodes.length) {
			var node = elm.removeChild(elm.childNodes[i])
			containerElement.appendChild(node);
		}
		elm.appendChild(containerElement);
	}
	// was originally planing to paragraphs where the first third ends in a
	// non-text node but I actually kinda like it as it is, only styling some
	// paragraphs
	//console.log(charCount_prev,charCount,startTarget);
})

for (var i = 0; i < leafElms.length; i += 1 + Math.ceil(leafElms.length / (100 / 3))) {
	var node = leafElms[i]
	node.classList.add('nmt_tracking')
	//console.log(node)
}

Array.from(document.querySelectorAll('p'))
.filter(elm => randomInt(1, 5) === 1)
.forEach(elm => {
	elm.classList.add('nmt_wordspacing')
	//console.log(elm)
})


/*******************
 * Util functions
 *******************/
// Nicked from here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

// takes a regex match and a text node and splits out matching text it into a new elm node 
function splitMatch(match, node) {
	var matchNode = node.splitText(match.index) 
	var followingNode = matchNode.splitText(match[0].length)
	var containerElement = document.createElement('span');
	node.parentNode.removeChild(matchNode)
	containerElement.appendChild(matchNode);
	node.parentNode.insertBefore(containerElement, followingNode);
	return containerElement
}

// for an element recursively nest each letter in new elements that have the same classes as the parent element
// eg <span class="tree">cake</span> would become:
// <span class="tree">c<span class="tree">a<span class="tree">k<span class="tree">e</span></span></span></span>
function nestLetters(elm) {
	// ignore if elm doesn't contain just one node which is a text node
	if (elm.childNodes.length !== 1 || elm.childNodes[0].nodeType !== Node.TEXT_NODE) return;
	// base case
	if(elm.textContent.length <= 1) return;
	var newChildNode = elm.childNodes[0].splitText(1)
	var containerElement = document.createElement('span');
	containerElement.className = elm.className;
	elm.removeChild(newChildNode)
	containerElement.appendChild(newChildNode);
	elm.appendChild(containerElement);
	nestLetters(containerElement);
	return containerElement
}