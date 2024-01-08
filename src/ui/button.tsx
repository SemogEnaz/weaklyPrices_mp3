import Link from 'next/link';

import '@/ui/button.css'

export function TopButton({ link, text }) {
    return (
        <Link 
            href={link}
            className='button-top'
        >
          {text}
        </Link>
    )
}

export function Button({ link, text }) {
    return (
        <Link 
            href={link}
            className='button'
        >
          {text}
        </Link>
    )
}

export function HomeButton() {
    return (
        <TopButton link={'/'} text={"Home"} />
    );
}