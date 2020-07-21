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
        let payments = await models.payment.find({ user: user });
        result.push(payments.map((payment) => payment._id));
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
