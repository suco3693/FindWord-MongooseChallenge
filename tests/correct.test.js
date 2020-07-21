const models = require('../models');
const { pullFirstUser, pullPaymentsForUsers, convertToStr } = require('../correct');

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

    // test('should connect to DB and be able to make new User', async () => {
    //     const newUser = new User({
    //         paid: true,
    //         signup_date: true,
    //     });
    //     let userID = newUser._id;
    //     await newUser.save();
    //     let users = await User.find({ _id: userID });
    //     expect(users.length).toBe(1);
    //     expect(users[0].paid).toBe(true);
    // });

    // test('pullFirstUser should pull first userId from userIDs if it relates to a user in DB', async () => {
    //     let userIDs = [];
    //     for (var count = 0; count < 5; count++) {
    //         let newUser = new User({
    //             paid: true,
    //             signup_date: true,
    //         });
    //         userIDs.push(newUser._id);
    //         await newUser.save();
    //     }

    //     let firstUser = await pullFirstUser(userIDs);
    //     expect(firstUser._id).toStrictEqual(userIDs[0]);
    // });
    // test('pullFirstUser should pull first id from userIDs that is related to a user in DB even if not first item in userIDs', async () => {
    //     let userIDs = ['5f175967192fa8057cddfa80', '5f175967192fa8057cddfa81', '5f175967192fa8057cddfa82'];
    //     for (var count = 0; count < 2; count++) {
    //         let newUser = new User({
    //             paid: true,
    //             signup_date: true,
    //         });
    //         userIDs.push(newUser._id);
    //         await newUser.save();
    //     }

    //     let firstUser = await pullFirstUser(userIDs);
    //     expect(firstUser._id).toStrictEqual(userIDs[3]);
    // });
    // test('pullFirstUser should return null if no user._id that relates to a user in DB is found ', async () => {
    //     let userIDs = ['5f175967192fa8057cddfa80', '5f175967192fa8057cddfa81', '5f175967192fa8057cddfa82'];
    //     let firstUser = await pullFirstUser(userIDs);
    //     expect(firstUser).toEqual(null);
    // });
    // test('pullFirstUser should return null if userIDs.length is 0 ', async () => {
    //     let userIDs = [];
    //     let firstUser = await pullFirstUser(userIDs);
    //     expect(firstUser).toEqual(null);
    // });
    test('pullPaymentsForUsers should output empty list if no users are inputted', async () => {
        let paymentList = await pullPaymentsForUsers();
        expect([]).toEqual(paymentList);
    });
    test('pullPaymentsForUsers should output empty list if no users array is empty', async () => {
        let paymentList = await pullPaymentsForUsers([]);
        expect([]).toEqual(paymentList);
    });
    test('pullPaymentsForUsers should output a list of payments that are associated with users in same index as user input index', async () => {
        let paymentsByUser = [];
        for (var count = 0; count < 5; count++) {
            let newUser = new User({
                paid: true,
                signup_date: true,
            });
            await newUser.save();
            let userPayment = [];
            for (var paymentCount = 0; paymentCount < 2; paymentCount++) {
                let newPayment = new Payment({
                    name: `Customer-${count}-payment-${paymentCount}`,
                    active: true,
                    amount: 100,
                    date: newUser.created,
                    user: newUser,
                });
                userPayment.push(newPayment._id);
                await newPayment.save();
            }
            paymentsByUser.push(userPayment);
        }
        let users = await User.find({});
        let paymentList = await pullPaymentsForUsers(users);
        expect(paymentsByUser).toEqual(paymentList);
    });
    test('pullPaymentsForUsers should work if user has no, 1, or many payments', async () => {
        let paymentsByUser = [];
        for (var count = 0; count < 3; count++) {
            let newUser = new User({
                paid: true,
                signup_date: true,
            });
            await newUser.save();
            let userPayment = [];
            for (var paymentCount = 0; paymentCount < count; paymentCount++) {
                let newPayment = new Payment({
                    name: `Customer-${count}-payment-${paymentCount}`,
                    active: true,
                    amount: 100,
                    date: newUser.created,
                    user: newUser,
                });
                userPayment.push(newPayment._id);
                await newPayment.save();
            }
            paymentsByUser.push(userPayment);
        }
        let users = await User.find({});
        let paymentList = await pullPaymentsForUsers(users);
        expect(paymentList[0].length).toBe(0);
        expect(paymentList[1].length).toBe(1);
        expect(paymentList[2].length).toBe(2);
        expect(paymentsByUser).toEqual(paymentList);
    });
    // test('convertToStr should convert numbers to strings ', async () => {
    //     let seven = convertToStr(7);
    //     expect(typeof seven).toBe('string');
    //     expect(seven).toBe('7');

    //     let pointOne = convertToStr(0.1);
    //     expect(typeof pointOne).toBe('string');
    //     expect(pointOne).toBe('0.1');

    //     let pi = convertToStr(3.1415);
    //     expect(typeof pi).toBe('string');
    //     expect(pi).toBe('3.1415');

    //     let expOneHunder = convertToStr(1e2);
    //     expect(typeof expOneHunder).toBe('string');
    //     expect(expOneHunder).toBe('100');
    // });
    // test('convertToStr should return undefined if input is not a number', async () => {
    //     expect(undefined).toBe(convertToStr('cat'));
    //     expect(undefined).toBe(convertToStr());
    //     expect(undefined).toBe(convertToStr(null));
    //     expect(undefined).toBe(convertToStr({}));
    //     expect(undefined).toBe(convertToStr(true));
    // });
});
