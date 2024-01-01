import { Inter } from 'next/font/google'
import { Tinos } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const tinos = Tinos({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}
      bg-black text-white 
      m-0
      `}>
        {children}
      </body>
    </html>
  )
}
