import { useState } from "react";
import { sendOTP, verifyOTP } from "../utils/twilioService";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Format phone number (add +91 if not present for Indian numbers)
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+91${formattedPhone}`;
      }

      await sendOTP(formattedPhone);
      setStep("otp");
      setMessage("OTP sent to your WhatsApp! Please check your messages.");
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = verifyOTP(otp);
      if (result.success) {
        // Redirect will happen automatically due to auth context change
        setMessage("Login successful! Redirecting...");
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to HRMS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "phone"
              ? "Enter your phone number to receive OTP"
              : "Enter the 6-digit OTP sent to your WhatsApp"}
          </p>
        </div>

        {step === "phone" ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter phone number (with country code)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                maxLength="6"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {message && (
          <div
            className={`text-center text-sm ${
              message.includes("Error") ||
              message.includes("Invalid") ||
              message.includes("expired")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
