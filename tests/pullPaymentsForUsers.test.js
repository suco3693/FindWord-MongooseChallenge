const models = require('../models');
const { pullPaymentsForUsers } = require('../correct');

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
        for (var count = 0; count < 2; count++) {
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
                userPayment.push(newPayment);
                await newPayment.save();
            }
            paymentsByUser.push(userPayment);
        }
        let users = await User.find({});
        let paymentList = await pullPaymentsForUsers(users);

        for (var user = 0; user < paymentsByUser.length; user++) {
            for (var payment = 0; payment < paymentsByUser[user].length; payment++) {
                expect(paymentList[user][payment]._id).toEqual(paymentsByUser[user][payment]._id);
                expect(paymentList[user][payment].name).toEqual(paymentsByUser[user][payment].name);
                expect(paymentList[user][payment].user._id).toEqual(paymentsByUser[user][payment].user._id);
            }
        }
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
                userPayment.push(newPayment);
                await newPayment.save();
            }
            paymentsByUser.push(userPayment);
        }
        let users = await User.find({});
        let paymentList = await pullPaymentsForUsers(users);
        expect(paymentList[0].length).toBe(0);
        expect(paymentList[1].length).toBe(1);
        expect(paymentList[2].length).toBe(2);
        for (var user = 0; user < paymentsByUser.length; user++) {
            for (var payment = 0; payment < paymentsByUser[user].length; payment++) {
                expect(paymentList[user][payment]._id).toEqual(paymentsByUser[user][payment]._id);
                expect(paymentList[user][payment].name).toEqual(paymentsByUser[user][payment].name);
                expect(paymentList[user][payment].user._id).toEqual(paymentsByUser[user][payment].user._id);
            }
        }
    });
});
