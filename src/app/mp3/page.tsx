import { HomeButton } from '@/ui/button';
import Waves from './waves';
import SubmissionForm from './submissionForm';
import Storm from './storm';

//import '@/ui/scrollBar.css';
import '@/app/global.css';
import '@/app/mp3/storm.css';

export default function Page() {

    const isRain = false;
    const isThunder = true;
    
    return (
        <div className='col-center max-w-[100vw] h-[100vh]'>

            <Storm 
                isRain={isRain}
                isThunder={isThunder}/>

            <HomeButton />

            <Waves body={<SubmissionForm/>} />
            
        </div>
    );
}