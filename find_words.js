/*
 * This program should find all words from a dictionary in a grid of letters. Words
 * can be matched in any direction (horizontally, vertically, and diagonally).
 * For example, if passed the dictionary {"cat", "dog", "bird", "plane"}, the program
 * should return the set {"cat", "dog"}.
 *
 * 	    |  C  |  C  |  C  |
 *      |  C  |  A  |  C  |
 *      |  C  |  C  |  T  |
 * 		|  D  |  O  |  G  |
 *
 * Your task is to implement the main function and any other functions you may need to
 * complete the task. In addition to functionality, you'll be assessed on code efficiency,
 * overall structure/code decomposition, and error handling.
 */

/**
 * Finds all words from the dictionary that are present in the grid of letters
 * @param {Array} wordGrid Letter grid represented as an array of char arrays.
 * The first array from the above example would be passed in
 * as ["C", "C", "C"] and the second would be ["C", "A", "C"], etc...)
 * @param {Set} dictionary Contains all words to look for in the letter grid
 * @returns {Set} All words from the dictionary that were found
 */

/*
	Input: (wordGrid) a 2D array of letters
		(dictionary) a Set of words 
	Output: (foundWords) a Set of words that were found in dictionary
	Constraints: case of letters/ words should not matter
				words can be found
					-horizontally
					-vertically
					-diginally 
				only need to find word once

	Edge Cases: wordGrid is empty
				dictionary is empty

	Assumptions:
		all rows of grid are the same length
		Only can use each letter of grid once
		case don't matter for words

	Pseduo
		turn (dictionary) into a tree (wordTree)
			with leafs being True for words
			
		write function to loop through wordGrid
			check if word is in (wordTree)
				if so 
					add to output
					remove that branch from wordTree
				
		return output
	

	Method
		get wordTree
		have var that is an emptySet (foundWords)
		have var startLetters = wordTree.children.map((child)=> child.val)
		loop through rows of wordGrid
			loop through col of wordGrid
				if wordGrid[row][col] is in startLetters
					wordSearch(row, col, childNode)
		
 */

function WordSearch(wordGrid, dictionary) {
    this.wordTree = makeWordTree(dictionary);
    this.wordGrid = convertGridToLowerCase(wordGrid);
    this.foundWords = new Set();
}
WordSearch.prototype.findWords = function () {
    let startLetters = this.wordTree.children.map((child) => child.value);
    let startLetterIdx = null;
    for (var row = 0; row < this.wordGrid.length; row++) {
        for (var col = 0; col < this.wordGrid[0].length; col++) {
            startLetterIdx = startLetters.indexOf(this.wordGrid[row][col]);
            if (startLetterIdx !== -1) {
                // traverseGrid(row, col, wordTree);
                this.traverse(
                    row,
                    col,
                    this.wordTree.children[startLetterIdx].value,
                    this.wordTree.children[startLetterIdx],
                    new Set(),
                );
            }
        }
    }
};
/*
I (row, col) int that represent row and col of this.wordGrid
	(currentWord) string
	(seenIdx) a set of seen Idx
	(currentNode) the current node in this.wordTree
O : none
SE: add (currentWord) to this.foundWords
C: once (currentWord) is found delete from this.wordTree
EC
A


Method
	check if currentNode.isWord is true
		if so add currentWord to this.foundWords
			remove currentWord from this.wordTree
	add row-col to seen

	go all this directions if not in seen and possible and letter is in currentNode.childrenValues
		directions
			up
			up right
			right
			down right
			down
			down left
			left
			up left

*/
WordSearch.prototype.traverse = function (row, col, currentWord, currentNode, seen) {
    if (seen.has(`${row}-${col}`)) {
        return;
    }
    if (currentNode.isWord) {
        this.foundWords.add(currentWord);
    }
    seen.add(`${row}-${col}`);
    //directions
    //goUp
    if (row > 0) {
        //go just Up
        this.moveDownTree(row - 1, col, currentWord, currentNode, seen);
        if (col < this.wordGrid[0].length) {
            this.moveDownTree(row - 1, col + 1, currentWord, currentNode, seen);
        }
        //goLeft
        if (col > 0) {
            this.moveDownTree(row - 1, col - 1, currentWord, currentNode, seen);
        }
        //go Up Right
        //go Up Left
    }
    //goRight
    if (col < this.wordGrid[0].length - 1) {
        this.moveDownTree(row, col + 1, currentWord, currentNode, seen);
    }
    //goLeft
    if (col > 0) {
        this.moveDownTree(row, col - 1, currentWord, currentNode, seen);
    }
    //goDown
    if (row < this.wordGrid.length - 1) {
        //go just Up
        this.moveDownTree(row + 1, col, currentWord, currentNode, seen);
        if (col < this.wordGrid[0].length) {
            this.moveDownTree(row + 1, col + 1, currentWord, currentNode, seen);
        }
        //goLeft
        if (col > 0) {
            this.moveDownTree(row + 1, col - 1, currentWord, currentNode, seen);
        }
        //go Up Right
        //go Up Left
    }
};
WordSearch.prototype.moveDownTree = function (row, col, currentWord, currentNode, seen) {
    if (currentNode.childrenValues[this.wordGrid[row][col]] !== undefined) {
        let childIdx = currentNode.childrenValues[this.wordGrid[row][col]];
        currentNode = currentNode.children[childIdx];
        currentWord += currentNode.value;
        this.traverse(row, col, currentWord, currentNode, seen);
    }
};
async function findWords(wordGrid, dictionary) {
    let wordSearch = new WordSearch(wordGrid, dictionary);
    wordSearch.findWords();

    return wordSearch.foundWords;
}
/*
I: (dictionary) a Set of words
O: (wordTree) a tree that represents all words
C: each word in dictionary should end with True
	words with similar start letters are combined
	root has no value
EC: 
A

Method
	make base node with no value (baseNode)

	loop through dictionary, dictionary.forEach((word)=>{
		currentNode = baseNode
		loop through letters of word 
			check if that letter is child value of currentNode
				if so go to that node
				else
					make new Node with that letter
					add it to children of currentNode
					currentNode = that child
	})
*/

/**********************
 *
 * Helper Functions
 */
function Node(value) {
    this.value = value.toLowerCase();
    this.isWord = false;
    this.children = [];
    this.childrenValues = {};
}
function findChildNode(letter, children) {
    let child = null;
    for (var childIdx = 0; childIdx < children.length; childIdx++) {
        child = children[childIdx];
        if (child.value === letter) {
            return childIdx;
        }
    }
    return -1;
}
function makeWordTree(dictionary) {
    let baseNode = new Node('');

    dictionary.forEach((word) => {
        let currentNode = baseNode;
        let childIdx = null;
        let newNode = null;
        for (var idx = 0; idx < word.length; idx++) {
            childIdx = findChildNode(word[idx], currentNode.children);
            if (childIdx < 0) {
                newNode = new Node(word[idx]);
                currentNode.children.push(newNode);
                currentNode.childrenValues[newNode.value] = Object.keys(currentNode.childrenValues).length;
                currentNode = newNode;
            } else {
                currentNode = currentNode.children[childIdx];
            }
            if (idx === word.length - 1) {
                currentNode.isWord = true;
            }
        }
    });
    return baseNode;
}

function removeWordFromTree(tree, word) {}
module.exports = {
    findWords,
    makeWordTree,
    Node,
};

function convertGridToLowerCase(grid) {
    return grid.map((row) => row.map((col) => col.toLowerCase()));
}
