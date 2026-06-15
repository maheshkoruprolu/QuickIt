import ApiEndpoints from "../common/ApiEndpoints";
import Axios from "./Axios";

const fetchCartItems = async () => {
    try {
        const response = await Axios({
            ...ApiEndpoints.get_cart_item,
        });

        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export default fetchCartItems;
