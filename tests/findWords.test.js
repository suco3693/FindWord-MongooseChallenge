const find_words = require('../find_words');

describe('find_words.findWords Test Suite', () => {
    test('findWords returns an Set', async () => {
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
});
