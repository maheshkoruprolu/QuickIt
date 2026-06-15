import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";
import { FaArrowLeft } from "react-icons/fa";

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSearchPage, useIsSearchPage] = useState(false);
    useEffect(() => {
        const isSearch = location.pathname === "/search";
        useIsSearchPage(isSearch);
    }, [location]);

    const redirectToSearchPage = () => {
        navigate("/search");
    };

    const [isMobile] = useMobile();
    const redirectToHomePage = () => {
        navigate("/");
    };

    return (
        <div className="w-full lg:min-w-[420px] h-11 lg:h-12 rounded-xl border border-slate-200 lg:border-slate-200 overflow-hidden flex items-center text-slate-500 bg-white lg:bg-slate-50 group focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/20 transition-all shadow-sm">
            <div>
                {isMobile && isSearchPage ? (
                    <button
                        onClick={redirectToHomePage}
                        className="items-center flex justify-center h-full p-3 group-focus-within:text-indigo-600 rounded-full bg-transparent hover:bg-slate-100 transition-colors"
                    >
                        <FaArrowLeft size={18} />
                    </button>
                ) : (
                    <button className="items-center flex justify-center h-full p-2 m-1 mr-3 group-focus-within:text-indigo-600">
                        <FaSearch size={20} />
                    </button>
                )}
            </div>
            <div className="w-full h-full">
                {!isSearchPage ? (
                    // displays when it is not search page
                    <div
                        className="w-full h-full flex items-center"
                        onClick={redirectToSearchPage}
                    >
                        <TypeAnimation
                            sequence={[
                                'Search "Chocolates"',
                                1000,
                                'Search "Milk"',
                                1000,
                                'Search "Bread"',
                                1000,
                            ]}
                            wrapper="span"
                            speed={50}
                            // style={{ display: "inline-block" }}
                            repeat={Infinity}
                        />
                    </div>
                ) : (
                    // displays when it is search page
                    <div className="w-full h-full">
                        <input
                            className="h-full w-full bg-transparent outline-none"
                            type="text"
                            autoFocus={true}
                            placeholder="Search Bread, Milk and more.."
                            defaultValue={new URLSearchParams(location.search).get("q") || ""}
                            onChange={(e) => {
                                const q = e.target.value;
                                if (q) {
                                    navigate(`/search?q=${q}`);
                                } else {
                                    navigate(`/search`);
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
