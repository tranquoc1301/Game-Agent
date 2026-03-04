// app/layout.tsx
import {ClerkProvider} from '@clerk/nextjs'
import {ThemeProvider} from 'next-themes'
import './globals.css'
import StarBackground from "@/components/StarBackground";
import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Game Chatbot',
    description: 'AI-powered game advisor',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="vi" suppressHydrationWarning>
            <body>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <StarBackground/>
                {children}
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    )
}
