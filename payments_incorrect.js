/* This file contains a number of issues. 
 * Your task is to fix the issues while retaining the intended functionality.
 * You can google and research on your own but we kindly ask that you don't
 * consult with someone else on these problems.
 * 
 * You should feel free to import libraries if they will help you make
 * the code simpler (no point in reinventing the wheel!)
 * 
 * Also, don't hesitate to ask if you have any questions about the intended
 * functionality of any of the problems below
 */

const
	models = require("./models");

/*
 * Pulls the first user from the user id list that can be found in the database.
 * If a particular user can't be found, ignore the id and look for the next user
 * until one can be found.
 */
function pullFirstUser(userIds) {
	return userIds.forEach(userId => {
		let user = models.user.findOne({_id: userId});
		if (user) return user;
	});
}
module.exports.pullFirstUser = pullFirstUser;

/*
 * Processes the sorted array and returns the results in
 * the same order as the input documents (e.g., the 
 * result of the first element in the argument array should
 * be stored in the first element of the result array, and so on...).
 */
function pullPaymentsForUsers(users) {
	let result = [];
	for (let user of users) {
		models.payment.findOne({user_id: user._id}).then(payments => {
			result.push(payments);
		});
	}
	return result; // array of array with payments (the first array should contain payments for the first user)
}
module.exports.pullPaymentsForUsers = pullPaymentsForUsers;

/*
 * Converts the number to a string (return nothing if 
 * something other than a number is passed to the function)
 */
function convertToString(num) {
	if (!num) return num.toString();
}
module.exports.convertToString = convertToString;

/*
 * Give the _id of the payment, return the payment
 * and user objects associated with it.
 * Sometimes the payment id might not match a payment.
 */
function getPaymentWithUser(paymentId) {
	let payment = models.payment.find({_id: paymentId});
	payment.user = models.user.find({_id: payment.user});
	return payment;
}
module.exports.getPaymentWithUser = getPaymentWithUser;

/*
 * Pulls all active payments for the users and retuns an object
 * mapping the user id to the user's payments (string to array).
 */
function getGroupedUserPmts(userIds) {
	let users = models.user.findOne({_id: userIds});

}
module.exports.getGroupedUserPmts = getGroupedUserPmts;