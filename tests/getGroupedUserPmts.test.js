const models = require('../models');
const {
    pullFirstUser,
    pullPaymentsForUsers,
    convertToStr,
    getPaymentWithUser,
    getGroupedUserPmts,
} = require('../correct');

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
    test('getGroupedUserPmts should pull all active payments and return object with keys of user_id and values of arrays of payment obejcts', async () => {
        let userIDS = [];
        let userID = null;
        let paymentID = null;
        let testPaymentIdsGroupedByUser = {};
        let paymentsIds = [];
        for (var count = 0; count < 3; count++) {
            paymentsIds = [];
            let newUser = new User({
                paid: true,
                signup_date: true,
            });
            userID = newUser._id;
            await newUser.save();
            for (var paymentCount = 0; paymentCount < 2; paymentCount++) {
                let newPayment = new Payment({
                    name: `Customer-${count}-payment-${paymentCount}`,
                    active: true,
                    amount: 100,
                    date: newUser.created,
                    user: newUser,
                });
                paymentID = newPayment._id;
                paymentsIds.push(paymentID);
                await newPayment.save();
            }
            userIDS.push(userID);
            testPaymentIdsGroupedByUser[userID] = paymentsIds;
        }
        let usersPayments = await getGroupedUserPmts(userIDS);
        Object.keys(usersPayments).forEach((userId, idx) => {
            let payments = usersPayments[userId];
            expect(testPaymentIdsGroupedByUser[userID]).not.toBe(undefined);
            let testPayments = testPaymentIdsGroupedByUser[userId];
            expect(payments.length).toBe(testPayments.length);
            for (var i = 0; i < payments.length; i++) {
                expect(payments[i]._id).toStrictEqual(testPayments[i]);
            }
        });
    });
    test('getGroupedUserPmts should only pull active payments and return object with keys of user_id and values of arrays of payment obejcts', async () => {
        let userIDS = [];
        let userID = null;
        let testPaymentIdsGroupedByUser = {};
        for (var count = 0; count < 3; count++) {
            let newUser = new User({
                paid: true,
                signup_date: true,
            });
            userID = newUser._id;
            await newUser.save();
            for (var paymentCount = 0; paymentCount < 2; paymentCount++) {
                let newPayment = new Payment({
                    name: `Customer-${count}-payment-${paymentCount}`,
                    active: false,
                    amount: 100,
                    date: newUser.created,
                    user: newUser,
                });
                await newPayment.save();
            }
            userIDS.push(userID);
            testPaymentIdsGroupedByUser[userID] = true;
        }
        let usersPayments = await getGroupedUserPmts(userIDS);
        Object.keys(usersPayments).forEach((userId, idx) => {
            let payments = usersPayments[userId];
            expect(testPaymentIdsGroupedByUser[userID]).toBe(true);
            expect(payments.length).toBe(0);
        });
    });
});
