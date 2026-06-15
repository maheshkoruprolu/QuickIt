import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="mt-10 border-t border-slate-200 bg-slate-950 text-slate-200">
            <div className="container mx-auto px-4 py-12 lg:py-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-400 font-bold mb-3">
                        QuickIt
                    </p>
                    <h2 className="text-3xl font-extrabold text-white max-w-sm">
                        Fast shopping, clean checkout, and a smoother account
                        experience.
                    </h2>
                    <p className="text-slate-400 mt-4 max-w-lg leading-7">
                        Discover products, manage your cart, and track orders
                        from one polished ecommerce experience built for speed.
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">
                        Explore
                    </p>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li>
                            <a
                                href="/"
                                className="hover:text-white transition-colors"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="/search"
                                className="hover:text-white transition-colors"
                            >
                                Search
                            </a>
                        </li>
                        <li>
                            <a
                                href="/cart"
                                className="hover:text-white transition-colors"
                            >
                                Cart
                            </a>
                        </li>
                        <li>
                            <a
                                href="/orders"
                                className="hover:text-white transition-colors"
                            >
                                Orders
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">
                        Connect
                    </p>
                    <div className="flex items-center gap-3 text-2xl">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <FaLinkedin />
                        </a>
                    </div>
                    <p className="text-sm text-slate-500 mt-5">
                        © 2025 QuickIt. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
