//"use client"

import { Inter } from 'next/font/google'
import { useState } from 'react';

import '@/app/global.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body className={`
        ${inter.className}
        bg-black text-white
      `}>
        {children}
      </body>
    </html>
  );
}
