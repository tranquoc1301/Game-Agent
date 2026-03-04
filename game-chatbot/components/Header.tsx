'use client';

import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import {MessageSquare} from 'lucide-react';
import {Button} from "@/components/ui/button";
import SettingsMenu from "@/components/SettingMenu";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-background">
            <div className="flex h-14 items-center px-4">
                {/* Logo */}
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <MessageSquare className="h-5 w-5" />
                    <span>GameMate</span>
                </div>

                {/* Right Side - Auth */}
                <div className="ml-auto flex items-center gap-2">
                    <SettingsMenu />


                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="outline" size="sm" className="cursor-pointer rounded-xl px-4 py-5">
                                Sign In
                            </Button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                            <Button variant="default" size="sm" className="cursor-pointer rounded-xl px-4 py-5">
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: 'h-8 w-8 cursor-pointer',
                                },

                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}
