"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function AuthButton() {
    const { data: session, status } = useSession();
    
    if (status === "loading") {
        return (
            <div className="animate-pulse flex items-center">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (session) {
        return (
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium hidden md:inline">
                        {session?.user?.name || session?.user?.email}
                    </span>
                </div>
                <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Sign Out
                </button>
            </div>
        );
    }
    
    return (
        <div className="flex items-center space-x-4">
            <span className="text-gray-500 text-sm">Not logged in</span>
            <button 
                onClick={() => signIn()}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Sign In
            </button>
        </div>
    );
}

export default function NavMenu() {
    const { data: session } = useSession();
    
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-gray-900">MedPortal</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Home
                            </Link>
                            {session && (
                                <>
                                    <Link href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                        Dashboard
                                    </Link>
                                    <Link href="/patients" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                        Patients
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <AuthButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}