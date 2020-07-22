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

/****
 *
 * Constructor Function to set all data sets of problem together
 */
function WordSearch(wordGrid, dictionary) {
    this.wordTree = makeWordTree(dictionary);
    this.wordGrid = convertGridToLowerCase(wordGrid);
    this.foundWords = new Set();
}

/*****
 * Functionality to find first letter of words from dictionary in wordGrid
 */
WordSearch.prototype.findWords = function () {
    let startLetters = this.wordTree.children.map((child) => child.value);
    let startLetterIdx = null;
    for (var row = 0; row < this.wordGrid.length; row++) {
        for (var col = 0; col < this.wordGrid[0].length; col++) {
            startLetterIdx = startLetters.indexOf(this.wordGrid[row][col]);
            if (startLetterIdx !== -1) {
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

/****
 *
 * Functionality to traverse wordGrid and find words that match words in wordTree, which is a tree that represents dictionary
 * Moves
 * 	-Up
 * 	-Up right
 * 	-Up left
 * 	-Right
 * 	-Left
 * 	-Down
 * 	-Down Right
 * 	-Down Left
 */
WordSearch.prototype.traverse = function (row, col, currentWord, currentNode, seen) {
    if (seen.has(`${row}-${col}`)) {
        return;
    }
    if (currentNode.isWord) {
        this.foundWords.add(currentWord);
    }

    seen.add(`${row}-${col}`);
    //goUp
    if (row > 0) {
        //go just Up
        this.moveDownTree(row - 1, col, currentWord, currentNode, seen);
        //goRight
        if (col < this.wordGrid[0].length) {
            this.moveDownTree(row - 1, col + 1, currentWord, currentNode, seen);
        }
        //go Left
        if (col > 0) {
            this.moveDownTree(row - 1, col - 1, currentWord, currentNode, seen);
        }
        //go Up Right
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
        //go just Down
        this.moveDownTree(row + 1, col, currentWord, currentNode, seen);
        //goRight
        if (col < this.wordGrid[0].length) {
            this.moveDownTree(row + 1, col + 1, currentWord, currentNode, seen);
        }
        //goLeft
        if (col > 0) {
            this.moveDownTree(row + 1, col - 1, currentWord, currentNode, seen);
        }
    }
    seen.delete(`${row}-${col}`);
};

/***
 *
 *  Traversal function to match current letter in wordGrid to potential matches
 *  in wordTree
 */
WordSearch.prototype.moveDownTree = function (row, col, currentWord, currentNode, seen) {
    if (currentNode.childrenValues[this.wordGrid[row][col]] !== undefined) {
        let childIdx = currentNode.childrenValues[this.wordGrid[row][col]];
        currentNode = currentNode.children[childIdx];
        currentWord += currentNode.value;
        this.traverse(row, col, currentWord, currentNode, seen);
    }
};

/*****
 * Base Function that creates WordSearch then finds words from dictionary
 *  in wordGrid
 */
async function findWords(wordGrid, dictionary) {
    if (dictionary.size === 0 || !wordGrid.length || !wordGrid[0].length) {
        return new Set();
    }
    let wordSearch = new WordSearch(wordGrid, dictionary);
    wordSearch.findWords();

    return wordSearch.foundWords;
}

/*****************************
 *
 *  Helper function to set all items in grid to lowercase
 */

function convertGridToLowerCase(grid) {
    return grid.map((row) => row.map((col) => col.toLowerCase()));
}

/**************************************************
 *
 * Helper Functions to make wordTree
 */

/***
 *
 *  Class Node to create Tree Nodes
 */
function Node(value) {
    this.value = value.toLowerCase();
    this.isWord = false;
    this.children = [];
    this.childrenValues = {};
}

/****
 *
 * Function to find if treeNode.children includes a letter
 * returns index of letter or -1
 */
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

/******
 *
 * Base Function to make wordTree from dictionary of words
 */
function makeWordTree(dictionary) {
    let baseNode = new Node('');

    dictionary.forEach((word) => {
        let currentNode = baseNode;
        let childIdx = null;
        let newNode = null;
        for (var idx = 0; idx < word.length; idx++) {
            childIdx = findChildNode(word[idx].toLowerCase(), currentNode.children);
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

module.exports = {
    findWords,
    makeWordTree,
    Node,
};
