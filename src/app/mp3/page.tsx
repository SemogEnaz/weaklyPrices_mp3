import { HomeButton } from '@/ui/button';
import Waves from './waves';
import SubmissionForm from './form';
import Storm from './storm';

import '@/ui/scrollBar.css';
import '@/app/global.css';
import '@/app/mp3/storm.css';

export default function Page() {

    const isRain = false;
    const isThunder = true;
    
    return (
        <div className='col-center'>

            <Storm 
                isRain={isRain}
                isThunder={isThunder}/>

            <div
            className='
                absolute
                top-10
                md:top-20

                text-6xl
                md:text-7xl
            '>
                .mp3
            </div>

            <Waves body={<SubmissionForm/>} />
            
        </div>
    );
}