//"use client"

import { Inter } from 'next/font/google'
import { useState } from 'react';

import '@/app/global.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  /*
  const [ cssId, setCssId ] = useState(0);

  let css = '';

  if (cssId == 0) {
    css = 'bg-black text-white';
  } else if (cssId == 1) {
    css = 'bg-blue-800 text-orange-400';
  } else if (cssId == 2) {
    css = 'bg-white-600 text-black';
  }

    console.log(cssId);
    console.log(css);
  */

  // ${css}

  return (
    <html lang="en">
      <body className={`${inter.className}
        bg-black text-white
      `}>
        {/*
        <div className='
          w-full h-7 bg-white
          flex items-center
          '>
          <button className='css-selector' onClick={() => setCssId(0)}>
          </button>
          <button className='css-selector' onClick={() => setCssId(1)}>
          </button>
          <button className='css-selector' onClick={() => setCssId(2)}>
          </button>
        </div>
        */}
        {children}
      </body>
    </html>
  );
}
