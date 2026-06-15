import React from "react";
import UserMenu from "../components/UserMenu";
import { IoClose } from "react-icons/io5";

const UserMenuMobile = () => {
    return (
        <section className="bg-white w-full h-full py-2">
            <button
                onClick={() => {
                    window.history.back();
                }}
                className="block ml-auto"
            >
                <div>
                    <IoClose size={25} />
                </div>
            </button>
            <div className="container mx-auto px-4 pb-8">
                <UserMenu />
            </div>
        </section>
    );
};

export default UserMenuMobile;
