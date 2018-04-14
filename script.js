var leafElms = []

// Made a few changes word levels
// A few references to House of Leaves
var house_re = /\w*House\w*|Haus|Maison/i
var minotaur_re = /Minotaur/i
var rn_re = /rn/
var queue = [document.body]
var node

while (node = queue.pop()) {
    for (var i = 0; i < node.childNodes.length; i++) {
		var subNode = node.childNodes[i];
		if (subNode.nodeType === Node.ELEMENT_NODE) {
			queue.push(subNode);
			if (subNode.childNodes.length === 1 && subNode.childNodes[0].nodeType === Node.TEXT_NODE) {
				leafElms.push(subNode)
			}

        } else if (subNode.nodeType === Node.TEXT_NODE) {
			var match
			if (match = subNode.textContent.match(house_re)) {
				splitMatch(match).classList.add('nmt_house')

			} else if (match = subNode.textContent.match(minotaur_re)) {
				splitMatch(match).classList.add('nmt_minotaur')

			} else if (match = subNode.textContent.match(rn_re)) {
				subNode.textContent = subNode.textContent.replace(rn_re, 'm')
			}
			function splitMatch(match) {
				var matchNode = subNode.splitText(match.index) 
				var followingNode = matchNode.splitText(match[0].length)
				var containerElement = document.createElement('span');
				containerElement.classList.add('nmt_house')
				node.removeChild(matchNode)
				containerElement.appendChild(matchNode);
				node.insertBefore(containerElement, followingNode);
				i += 2
				return containerElement
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