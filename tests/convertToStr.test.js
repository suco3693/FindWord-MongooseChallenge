const models = require('../models');
const { convertToStr } = require('../correct');
describe('insert', () => {
    //Delete all documents before and after each test
    beforeEach(async () => {
        await models.user.deleteMany({});
        await models.payment.deleteMany({});
    });

    afterEach(async () => {
        await models.user.deleteMany({});
        await models.payment.deleteMany({});
    });
    afterAll(async () => {
        await models.connection.close();
    });
    test('convertToStr should convert numbers to strings ', async () => {
        let seven = convertToStr(7);
        expect(typeof seven).toBe('string');
        expect(seven).toBe('7');

        let pointOne = convertToStr(0.1);
        expect(typeof pointOne).toBe('string');
        expect(pointOne).toBe('0.1');

        let pi = convertToStr(3.1415);
        expect(typeof pi).toBe('string');
        expect(pi).toBe('3.1415');

        let expOneHunder = convertToStr(1e2);
        expect(typeof expOneHunder).toBe('string');
        expect(expOneHunder).toBe('100');
    });
    test('convertToStr should return undefined if input is not a number', async () => {
        expect(undefined).toBe(convertToStr('cat'));
        expect(undefined).toBe(convertToStr());
        expect(undefined).toBe(convertToStr(null));
        expect(undefined).toBe(convertToStr({}));
        expect(undefined).toBe(convertToStr(true));
    });
});
