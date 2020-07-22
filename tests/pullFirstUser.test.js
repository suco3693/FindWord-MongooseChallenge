const models = require('../models');
const { pullFirstUser } = require('../correct');

const User = models.user;
const Payment = models.payment;

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
    test('pullFirstUser should pull first userId from userids if it relates to a user in DB', async () => {
        let userids = [];
        for (var count = 0; count < 5; count++) {
            let newUser = new User({
                paid: true,
                signup_date: true,
            });
            userids.push(newUser._id);
            await newUser.save();
        }

        let firstUser = await pullFirstUser(userids);
        expect(firstUser._id).toStrictEqual(userids[0]);
    });
    test('pullFirstUser should pull first id from userids that is related to a user in DB even if not first item in userids', async () => {
        let userids = ['5f175967192fa8057cddfa80', '5f175967192fa8057cddfa81', '5f175967192fa8057cddfa82'];
        for (var count = 0; count < 2; count++) {
            let newUser = new User({
                paid: true,
                signup_date: true,
            });
            userids.push(newUser._id);
            await newUser.save();
        }

        let firstUser = await pullFirstUser(userids);
        expect(firstUser._id).toStrictEqual(userids[3]);
    });
    test('pullFirstUser should return null if no user._id that relates to a user in DB is found ', async () => {
        let userids = ['5f175967192fa8057cddfa80', '5f175967192fa8057cddfa81', '5f175967192fa8057cddfa82'];
        let firstUser = await pullFirstUser(userids);
        expect(firstUser).toEqual(null);
    });
    test('pullFirstUser should return null if userids.length is 0 ', async () => {
        let userids = [];
        let firstUser = await pullFirstUser(userids);
        expect(firstUser).toEqual(null);
    });
});
