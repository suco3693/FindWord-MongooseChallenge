const find_words = require('../find_words');

describe('find_words.findWords Test Suite', () => {
    test('findWords returns empty Set if dictionary is empty', async () => {
        let dictionary = new Set();
        let wordGrid = [
            ['C', 'C', 'C'],
            ['C', 'A', 'C'],
            ['C', 'C', 'T'],
            ['D', 'O', 'G'],
        ];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(0);
    });
    test('findWords returns empty Set if wordGrid is empty', async () => {
        let dictionary = new Set();
        dictionary.add('cat');
        dictionary.add('dog');
        dictionary.add('bird');
        dictionary.add('plane');
        let wordGrid = [[]];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(0);
    });
    test('findWords returns an Set matches between dictionary and wordGrid', async () => {
        let dictionary = new Set();
        dictionary.add('cat');
        dictionary.add('dog');
        dictionary.add('bird');
        dictionary.add('plane');
        let wordGrid = [
            ['c', 'c', 'c'],
            ['c', 'a', 'e'],
            ['c', 'c', 't'],
            ['d', 'o', 'g'],
        ];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(2);
    });
    test('findWords should be case insenstive for WordGird', async () => {
        let dictionary = new Set();
        dictionary.add('cat');
        dictionary.add('dog');
        dictionary.add('bird');
        dictionary.add('plane');
        let wordGrid = [
            ['C', 'C', 'C'],
            ['C', 'A', 'E'],
            ['C', 'C', 'T'],
            ['D', 'O', 'G'],
        ];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(2);
    });
    test('findWords should be case insenstive for dictionary words', async () => {
        let dictionary = new Set();
        dictionary.add('CAT');
        dictionary.add('DOG');
        dictionary.add('BIRD');
        dictionary.add('PLANE');
        let wordGrid = [
            ['c', 'c', 'c'],
            ['c', 'a', 'e'],
            ['c', 'c', 't'],
            ['d', 'o', 'g'],
        ];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(2);
    });
    test('findWords should work if only 1 row', async () => {
        let dictionary = new Set();
        dictionary.add('CAT');
        dictionary.add('TAC');
        let wordGrid = [['C', 'A', 'C', 'A', 'T']];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(2);
    });
    test('findWords should work if only 1 col', async () => {
        let dictionary = new Set();
        dictionary.add('CAT');
        dictionary.add('TAC');
        let wordGrid = [['C'], ['A'], ['C'], ['A'], ['T']];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(2);
    });
    test('findWords should not go back to letters it already looked at', async () => {
        let dictionary = new Set();
        dictionary.add('wow');
        dictionary.add('dodge');
        dictionary.add('mom');
        let wordGrid = [
            ['W', 'O', 'T'],
            ['O', 'D', 'O'],
            ['C', 'G', 'W'],
            ['Z', 'E', 'F'],
        ];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(0);
    });
    test('findWords finds words that are substrings of other words', async () => {
        let dictionary = new Set();
        dictionary.add('woo');
        dictionary.add('woot');
        dictionary.add('wooto');
        let wordGrid = [
            ['W', 'O', 'T'],
            ['O', 'D', 'O'],
            ['C', 'G', 'W'],
            ['Z', 'E', 'F'],
        ];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(3);
    });
    test('findWords finds same word only once', async () => {
        let dictionary = new Set();
        dictionary.add('WOOW');
        let wordGrid = [
            ['W', 'O', 'T'],
            ['O', 'D', 'O'],
            ['C', 'G', 'W'],
            ['Z', 'E', 'F'],
        ];
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(1);
    });
    test('findWords finds same word only once', async () => {
        let dictionary = new Set();
        dictionary.add('A');
        let wordGrid = [];
        let row = [];
        for (var i = 0; i < 100; i++) {
            row = [];
            for (var j = 0; j < 100; j++) {
                row.push('A');
            }
            wordGrid.push(row);
        }
        let foundWords = await find_words.findWords(wordGrid, dictionary);
        expect(foundWords.size).toBe(1);
    });
});
