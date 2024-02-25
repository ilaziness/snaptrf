import {Inter} from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import {Snackbar} from "@mui/joy";
import React from "react";
import {AlertComponent} from "@/components/alert";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: '阅后即焚 - SnapTrf',
    description: '阅后即焚App',
}

export default function RootLayout({children}) {

    const year = (new Date()).getFullYear()
    return (
        <html lang="en">
        <body className={inter.className}>
        <header>
            <Link href="/" className="brand">SnapTrf</Link>
        </header>
        <main>
            <div className="main-body">{children}</div>
        </main>
        <footer>
            &copy;&nbsp;{year}&nbsp;SnapTrf App
        </footer>
        <AlertComponent />
        </body>
        </html>
    )
}
