import ApiEndpoints from "../common/ApiEndpoints";
import Axios from "./Axios";

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...ApiEndpoints.user_details,
        });

        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export default fetchUserDetails;
