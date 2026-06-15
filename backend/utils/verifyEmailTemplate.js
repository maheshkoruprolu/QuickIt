const verifyEmailTemplate = ({ name, url }) => {
    return `
    <p>Dear ${name},</p>
    <p>ThankYou for registering in QuickIt</p>

    <button style="width: 50px; height: 30px">
        <a href=${url} style="color: white; background: blue; margin-top: 10px; padding: 10px 20px">
            Verify Email
        </a>
    </button>
    `;
};

export default verifyEmailTemplate;
