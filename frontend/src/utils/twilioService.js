import { Twilio } from 'twilio';

const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
	throw new Error('Missing Twilio environment variables');
}

const client = new Twilio(accountSid, authToken);

// Generate a 6-digit OTP
const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via WhatsApp
export const sendOTP = async (phoneNumber) => {
	try {
		const otp = generateOTP();

		// Store OTP with timestamp (expires in 5 minutes)
		const otpData = {
			otp,
			timestamp: Date.now(),
			phoneNumber
		};
		localStorage.setItem('otp_data', JSON.stringify(otpData));

		// Send WhatsApp message
		const message = await client.messages.create({
			body: `Your HRMS verification code is: ${otp}. This code will expire in 5 minutes.`,
			from: `whatsapp:${twilioPhoneNumber}`,
			to: `whatsapp:${phoneNumber}`
		});

		return { success: true, messageId: message.sid };
	} catch (error) {
		console.error('Error sending OTP:', error);
		throw new Error('Failed to send OTP. Please try again.');
	}
};

// Verify OTP
export const verifyOTP = (enteredOTP) => {
	try {
		const otpData = JSON.parse(localStorage.getItem('otp_data'));

		if (!otpData) {
			throw new Error('No OTP found. Please request a new one.');
		}

		// Check if OTP is expired (5 minutes)
		const now = Date.now();
		const otpAge = now - otpData.timestamp;
		const fiveMinutes = 5 * 60 * 1000;

		if (otpAge > fiveMinutes) {
			localStorage.removeItem('otp_data');
			throw new Error('OTP has expired. Please request a new one.');
		}

		if (otpData.otp === enteredOTP) {
			// OTP verified successfully
			localStorage.removeItem('otp_data');
			// Store user session
			localStorage.setItem('user_session', JSON.stringify({
				phoneNumber: otpData.phoneNumber,
				loginTime: now
			}));
			return { success: true };
		} else {
			throw new Error('Invalid OTP. Please try again.');
		}
	} catch (error) {
		throw error;
	}
};

// Check if user is logged in
export const isLoggedIn = () => {
	const session = localStorage.getItem('user_session');
	if (!session) return false;

	const sessionData = JSON.parse(session);
	// Session expires after 24 hours
	const now = Date.now();
	const sessionAge = now - sessionData.loginTime;
	const twentyFourHours = 24 * 60 * 60 * 1000;

	if (sessionAge > twentyFourHours) {
		localStorage.removeItem('user_session');
		return false;
	}

	return true;
};

// Get current user
export const getCurrentUser = () => {
	const session = localStorage.getItem('user_session');
	return session ? JSON.parse(session) : null;
};

// Logout
export const logout = () => {
	localStorage.removeItem('user_session');
	localStorage.removeItem('otp_data');
};
