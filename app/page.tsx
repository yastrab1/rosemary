"use client";

import {useConvexAuth} from "convex/react";
import {useAuthActions} from "@convex-dev/auth/react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Posts from "@/components/Posts";
import {AddPost} from "@/components/AddPost";
import {useState} from "react";
import UploadButton from "@/components/UploadButton";
import UploadAttachments from "@/components/UploadButton";

export default function Home() {


    return (
        <>
            <header
                className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 border-b border-slate-200 dark:border-slate-700 flex flex-row justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.png" alt="Convex Logo" width={150} height={0 }/>

                    </div>
                    <h1 className="font-semibold text-slate-800">
                        Alex Markus
                    </h1>
                </div>
                <SignOutButton/>
            </header>
            <main className="p-8 flex flex-col gap-8">
                <Posts/>

                <AddPost />
            </main>
        </>
    );
}

function SignOutButton() {
    const {isAuthenticated} = useConvexAuth();
    const {signOut} = useAuthActions();
    const router = useRouter();
    return (
        <>
            {isAuthenticated && (
                <button
                    className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() =>
                        void signOut().then(() => {
                            router.push("/signin");
                        })
                    }
                >
                    Sign out
                </button>
            )}
        </>
    );
}
