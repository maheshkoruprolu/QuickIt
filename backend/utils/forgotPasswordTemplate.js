const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div>
            <p>Dear, ${name}</p>
            <p>You're requested to password reset. Please use following OTP code to reset your password</p>
            <div style="background: yellow; font-size: 20px; font-weight: 800; text-align: center; padding: 50px;">
                ${otp}
            </div>
            <p>This OTP is only valid for 1hr only. Enter this OTP in QuickIt website to proceed with resetting your password</p>
        </div>
    `;
};

export default forgotPasswordTemplate;
