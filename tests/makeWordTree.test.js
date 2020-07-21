const find_words = require('../find_words');

function traverseTreeDFS(node, idx, sampleValues) {
    expect(node.value).toBe(sampleValues[idx]);
    Object.keys(node.childrenValues).forEach((key) => {
        let idx = node.childrenValues[key];
        expect(key).toEqual(node.children[idx].value);
    });
    if (idx === sampleValues.length - 1) {
        expect(node.isWord).toBe(true);
    } else {
        expect(node.isWord).toBe(false);
    }
    node.children.forEach((child) => {
        traverseTreeDFS(child, idx + 1, sampleValues);
    });
}
function traverseTreeBFS(node, expectedEnd, expectedValues) {
    let bfsNodes = [node];
    let bsfValues = [node.value];

    for (var idx = 0; idx < bfsNodes.length; idx++) {
        if (expectedEnd[bfsNodes[idx].val]) {
            expect(bfsNodes[idx].isWord).toBe(true);
        }
        bfsNodes[idx].children.forEach((child) => {
            bfsNodes.push(child);
            bsfValues.push(child.value);
        });
    }
    expect(expectedValues.length).toBe(bsfValues.length);
    expectedValues.forEach((val, idx) => {
        expect(val).toBe(bsfValues[idx]);
    });
}
describe('find_words.makeWordTree Test Suite', () => {
    test('Node makes a new node with val, empty chldren array, and empty childValues object', () => {
        let node = new find_words.Node('a');
        expect(node.value).toBe('a');
        expect(node.children.length).toBe(0);
        expect(node.isWord).toBe(false);
        expect(Object.keys(node.childrenValues).length).toBe(0);
    });
    test('Node converts letter to lowercase', () => {
        let node = new find_words.Node('A');
        expect(node.value).toBe('a');
        expect(node.children.length).toBe(0);
        expect(node.isWord).toBe(false);
    });
    test('makeWordTree makes 1 word dictionary into a tree and has proper isWord boolean at only end', () => {
        let sampleDic = new Set();
        sampleDic.add('CAT');
        let sampleValues = ['', 'c', 'a', 't'];
        let wordTree = find_words.makeWordTree(sampleDic);
        traverseTreeDFS(wordTree, 0, sampleValues);
    });
    test('makeWordTree makes 2 distince word dictionary into a tree and has proper isWord boolean at only end', () => {
        let sampleDic = new Set();
        sampleDic.add('cat');
        sampleDic.add('dog');
        let wordTree = find_words.makeWordTree(sampleDic);
        expect(wordTree.value).toBe('');
        wordTree.children.forEach((child) => {
            let sampleValues = null;
            if (child.value === 'd') {
                sampleValues = ['d', 'o', 'g'];
            } else {
                sampleValues = ['c', 'a', 't'];
            }
            traverseTreeDFS(child, 0, sampleValues);
        });
    });
    test('makeWordTree makes 2 overlaping word dictionary into a tree and has proper isWord boolean at only end', () => {
        let sampleDic = new Set();
        sampleDic.add('cat');
        sampleDic.add('cake');
        let expectedValues = ['', 'c', 'a', 't', 'k', 'e'];
        let expectedEnd = {
            t: true,
            e: true,
        };
        let wordTree = find_words.makeWordTree(sampleDic);
        traverseTreeBFS(wordTree, expectedEnd, expectedValues);
    });
    test('makeWordTree makes 2 words, where one is a subword of other, into a tree with proper isWord tags', () => {
        let sampleDic = new Set();
        sampleDic.add('catie');
        sampleDic.add('cat');
        let expectedValues = ['', 'c', 'a', 't', 'i', 'e'];
        let expectedEnd = {
            t: true,
            e: true,
        };
        let wordTree = find_words.makeWordTree(sampleDic);
        traverseTreeBFS(wordTree, expectedEnd, expectedValues);
    });
    test('makeWordTree makes 2 words, where one is a subword of other, into a tree with proper isWord tags', () => {
        let sampleDic = new Set();
        sampleDic.add('WOA');
        sampleDic.add('WOAT');
        sampleDic.add('WOATE');
        let expectedValues = ['', 'w', 'o', 'a', 't', 'e'];
        let expectedEnd = {
            a: true,
            t: true,
            e: true,
        };
        let wordTree = find_words.makeWordTree(sampleDic);
        traverseTreeBFS(wordTree, expectedEnd, expectedValues);
    });
});
