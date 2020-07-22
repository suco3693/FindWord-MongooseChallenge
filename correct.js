/*
 * Put the correct implementation of incorrect.js here.
 */

const models = require('./models');

/*
 * Pulls the first user from the user id list that can be found in the database.
 * If a particular user can't be found, ignore the id and look for the next user
 * until one can be found.
 */
async function pullFirstUser(userIds) {
    for (var idx = 0; idx < userIds.length; idx++) {
        let user = await models.user.findOne({ _id: userIds[idx] });
        if (user) {
            return user;
        }
    }
    return null;
}
module.exports.pullFirstUser = pullFirstUser;

/*
 * Processes the sorted array and returns the results in
 * the same order as the input documents (e.g., the
 * result of the first element in the argument array should
 * be stored in the first element of the result array, and so on...).
 */
async function pullPaymentsForUsers(users) {
    let result = [];
    if (!users) {
        return result;
    }
    for (let user of users) {
        let payments = await models.payment.find({ user: user }).populate('user');
        result.push(payments);
    }
    return result; // array of array with payments (the first array should contain payments for the first user)
}
module.exports.pullPaymentsForUsers = pullPaymentsForUsers;

/*
 * Converts the number to a string (return nothing if
 * something other than a number is passed to the function)
 */
function convertToStr(num) {
    if (typeof num !== 'number') {
        return;
    } else {
        return num.toString();
    }
}
module.exports.convertToStr = convertToStr;

/*
 * Give the _id of the payment, return the payment
 * and user objects associated with it.
 * Sometimes the payment id might not match a payment.
 */
async function getPaymentWithUser(paymentId) {
    let payment = await models.payment.findOne({ _id: paymentId }).populate('user');
    return payment ? payment : null;
}
module.exports.getPaymentWithUser = getPaymentWithUser;

/*
 * Pulls all active payments for the users and returns an object
 * mapping the user id to the user's payments (string to array).
 * Note: userIds is passed in as an array of strings
 *
 * Note: Active
 */
async function getGroupedUserPmts(userIds) {
    let result = {};
    let payments = [];
    for (const userId of userIds) {
        payments = await models.payment.find({ user: userId, active: true });
        result[userId] = payments;
    }
    return result;
}
module.exports.getGroupedUserPmts = getGroupedUserPmts;
