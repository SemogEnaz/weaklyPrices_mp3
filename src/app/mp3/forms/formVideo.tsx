import { useEffect, useState } from "react";
import { formOptions, checkboxOptions,
    makeCheckboxsRaw, makeCheckboxes, makeDependingCheckboxes } from "./checkbox";

export default function VideoForm({ url, setLoading, setFileName }: 
    { url: string, setLoading: (options: {isLoading: boolean, message: string}) => void, setFileName: (option: string) => void }) {

    const [videoOptions, setVideoOptions] = useState(() => {
        return ({
            'format': '',
            'thumbnail': '',    // embed, download
            'subtitles': '',    // embed, ''
            'chapters': '',     // write, ''
            'sponsor': '',      // mark, remove
        })
    });

    const state = {
        options: videoOptions,
        setOptions: setVideoOptions
    };

    const [hasFormat, setHasFormat] = useState(false);
    const [isSubmit, setSubmit] = useState(false);

    useEffect(() => {
        setHasFormat(videoOptions['format'] != '');
    }, [videoOptions['format'], hasFormat]);

    useEffect(() => {

        if (!isSubmit) return;

        const getVideoOptions = () => {
            const isAudio = '&isAudio=false';
            const fileType = 'format;' + videoOptions['format'];
            const subtitles = 'subtitles;' + videoOptions['subtitles'];
            const chapters = 'chapters;' + videoOptions['chapters'];
            const sponsor = 'sponsor;' + videoOptions['sponsor'];

            return isAudio + '&options=' + encodeURIComponent(
                fileType + ';' + subtitles + ';' + chapters + ';' + sponsor
            );
        }

        let apiUrl = '/api/mp3/downloadVideo?';
        apiUrl += `url=${encodeURIComponent(url)}`;

        let apiParam = getVideoOptions();
        apiUrl += apiParam;

        const fetchData = async () => {

            setLoading({
                isLoading: true,
                message: 'Downloading Video'
            });

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                setFileName(data.fileName);
            } catch (error) {
                console.error('Fetch error: ', error);
            }
        };
    
        fetchData();
        setSubmit(false);

    }, [isSubmit]);

    const formats = makeCheckboxsRaw(
        ['.mkv', '.mp4', '[best]'],
        ['mkv', 'mp4', 'best'],
        'format');
    const formatComponent = makeCheckboxes(
        formats, state);

    const subtitles = makeCheckboxsRaw(['Subtitles'], ['embed'], 'subtitles');
    const chapters = makeCheckboxsRaw(['Chapters'], ['embed'], 'chapters');
    const subsNchapsComponent = makeDependingCheckboxes(
        [...subtitles, ...chapters], state, hasFormat);

    const sponsor = makeCheckboxsRaw(
        ['Mark', 'Remove'],
        ['mark', 'remove'],
        'sponsor');
    const sponsorComponent = makeDependingCheckboxes(
        sponsor, state, hasFormat);

    return (
        <>
            {formOptions(
                'File Formats:', checkboxOptions(formatComponent))}
            <div className="one-line-options">
                {formOptions(
                    'Write to Video:', checkboxOptions(subsNchapsComponent))}
                {formOptions(
                    'Sponsor Handling:', checkboxOptions(sponsorComponent))}
            </div>
            <div
                    className='submition-button' 
                    onClick={() => {
                        setSubmit(true);
                    }}>
                    Submit
            </div>
            
        </>
    );
}