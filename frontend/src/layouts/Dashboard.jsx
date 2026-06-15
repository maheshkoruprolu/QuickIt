import React from "react";
import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

const Dashboard = () => {
    return (
        <section className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#f8fafc_100%)] py-6 lg:py-8">
            <div className="container mx-auto px-4 grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
                <aside className="sticky top-24 hidden lg:block h-fit">
                    <div className="bg-white/90 backdrop-blur-md rounded-[1.75rem] shadow-sm border border-slate-200 p-3">
                        <UserMenu inDashboard={true} />
                    </div>
                </aside>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-5 sm:p-6 lg:p-8 min-h-[70vh]">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                                Dashboard
                            </p>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800">
                                Account Center
                            </h1>
                        </div>
                        <div className="hidden sm:block text-sm text-slate-500">
                            Manage profile, orders, and admin tools in one
                            place.
                        </div>
                    </div>

                    <Outlet />
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
