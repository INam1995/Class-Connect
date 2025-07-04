import mongoose from 'mongoose';
import otpTemplate from '../mail/templates/emailVerificationTemplate.js';

import mailSender from '../utils/MailSender.js';

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, 
	},
});

async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			'Verification Email',
			otpTemplate(otp)
		);
		console.log('Email sent successfully: ', mailResponse.response);
	} catch (error) {
		console.log('Error occurred while sending email: ', error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre('save', async function (next) {
	console.log('New document saved to database');

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model('OTP', OTPSchema);

export default OTP;
export { sendVerificationEmail }; // Add this at the bottom of the file

