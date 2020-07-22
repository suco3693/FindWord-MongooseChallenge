const models = require('../models');
const { getPaymentWithUser } = require('../correct');

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
    test('getPaymentWithUser should return payment with user object associated with known payment id', async () => {
        let ids = [];
        let userID = null;
        let paymentID = null;
        for (var count = 0; count < 2; count++) {
            let newUser = new User({
                paid: true,
                signup_date: true,
            });
            userID = newUser._id;
            await newUser.save();
            let newPayment = new Payment({
                name: `Customer-${count}-payment-0`,
                active: true,
                amount: 100,
                date: newUser.created,
                user: newUser,
            });
            paymentID = newPayment._id;
            await newPayment.save();
            ids.push([userID, paymentID]);
        }

        for (var idx = 0; idx < ids.length; idx++) {
            let id = ids[idx];
            let paymentWithUser = await getPaymentWithUser(id[1]);
            let user = await User.findOne({ _id: id[0] });
            expect(paymentWithUser._id).toStrictEqual(id[1]);
            expect(paymentWithUser.user._id).toStrictEqual(user._id);
        }
    });
    test('getPaymentWithUser should return null if no payment is assoicated with id', async () => {
        //Fake seed ids that are not asscoaited with any user or payment
        let ids = [
            ['5f1873fc726bad0ba0a79207', '5f1873fc726bad0ba0a79208'],
            ['5f1873fc726bad0ba0a79209', '5f1873fc726bad0ba0a7920a'],
        ];

        for (var idx = 0; idx < ids.length; idx++) {
            let id = ids[idx];
            let paymentWithUser = await getPaymentWithUser(id[1]);
            expect(paymentWithUser).toEqual(null);
        }
    });
});
