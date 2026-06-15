const generateOTP = () => {
    return Math.floor(Math.random() * 900000) + 100000; // it will produce from 100000 to 999999
};

export default generateOTP;
