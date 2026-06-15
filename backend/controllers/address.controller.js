import addressModel from "../models/address.model.js";
import userModel from "../models/user.model.js";

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { address_line, city, state, pincode, country, mobile } = req.body;

        const createAddress = new addressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        });

        const saveAddress = await createAddress.save();

        await userModel.updateOne(
            { _id: userId },
            {
                $push: { address_details: saveAddress._id }
            }
        );

        return res.status(200).json({
            message: "Address added successfully",
            error: false,
            success: true,
            data: saveAddress
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId).populate('address_details');

        return res.status(200).json({
            message: "Addresses fetched",
            error: false,
            success: true,
            data: user.address_details
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateAddressController = async (req, res) => {
    try {
        const { _id, address_line, city, state, pincode, country, mobile } = req.body;

        const updateAddress = await addressModel.updateOne({ _id: _id }, {
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        });

        return res.status(200).json({
            message: "Address updated successfully",
            error: false,
            success: true,
            data: updateAddress
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        const disableAddress = await addressModel.updateOne({ _id: _id }, {
            status: false
        });

        return res.status(200).json({
            message: "Address removed",
            error: false,
            success: true,
            data: disableAddress
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
