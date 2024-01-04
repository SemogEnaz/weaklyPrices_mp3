import Link from 'next/link';

import { Button } from '@/ui/button';

export default function Page() {
  return (
    <div className='
      h-[100vh] 
      flex flex-col items-center justify-around
      '>

      <div className='flex flex-col items-center'>
        <h2>Applications</h2>
        <Button link={'/weaklyPrices'} text={"Weakly Prices"}/>
        <Button link={'/mp3'} text={'Youtube Video Downloader'}/>
        <Button link={'/IgConnections'} text={'Instagram mutual finder'}/>
      </div>
      
      <div className='flex flex-col items-center'>
        <h2>Blogs</h2>
      </div>
      
    </div>
  );
}