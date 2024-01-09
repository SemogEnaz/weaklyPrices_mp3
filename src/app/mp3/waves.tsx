import '@/app/mp3/waves.css';

import Image from 'next/image';

export default function Waves({ body }) {

    const Wave = () => {
        return (
            <Image 
                src='/mp3/wave.svg' 
                alt="wave"
                width={400}
                height={160}
                style={{
                    width: '100vw',
                    height: 'auto',
                }}
            />
        );
    }

    return (
        <>
        <div className='wave-container'>

            <div className='boat-container'>
                <div className='boat'></div>
            </div>

            <div className='wave ahead absolute'>
                <Wave />
            </div>

            <div className='wave behind'>
                <Wave />
            </div>
            
        </div>

        <div className='ocean'>
            {body}
        </div>
        </>
    );
}