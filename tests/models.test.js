const models = require('../models');

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

    test('should connect to DB and be able to make new User', async () => {
        const newUser = new User({
            paid: true,
            signup_date: true,
        });
        let userID = newUser._id;
        await newUser.save();
        let users = await User.find({ _id: userID });
        expect(users.length).toBe(1);
        expect(users[0].paid).toBe(true);
    });
    test('should connect to DB and be able to make new User', async () => {
        const newUser = new User({
            paid: true,
            signup_date: true,
        });
        let userID = newUser._id;
        await newUser.save();
        const newPayment = new Payment({
            name: `testPayment`,
            active: true,
            amount: 100,
            date: newUser.created,
            user: newUser,
        });
        let paymentID = newPayment._id;
        await newPayment.save();
        let payments = await Payment.find({ _id: paymentID });
        expect(payments.length).toBe(1);
        expect(payments[0]._id).toStrictEqual(paymentID);
    });
});
