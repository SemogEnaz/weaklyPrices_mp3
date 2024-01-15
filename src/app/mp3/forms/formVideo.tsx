import { useEffect, useState } from "react";
import { formOptions, checkboxOptions,
    makeCheckboxsRaw, makeCheckboxes, makeDependingCheckboxes } from "./checkbox";

export default function VideoForm({ url, title }: { url: string, title: string}) {

    const [videoOptions, setVideoOptions] = useState(() => {
        return ({
            'format': '',
            'thumbnail': '',    // embed, download
            'subtitles': '',    // embed, none
            'chapters': '',     // write, none
            'sponsor': '',      // mark, remove
        })
    });

    const state = {
        options: videoOptions,
        setOptions: setVideoOptions
    };

    const [hasFormat, setHasFormat] = useState(false);

    useEffect(() => {

        setHasFormat(videoOptions['format'] != '');

    }, [videoOptions['format'], hasFormat]);

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
                        //setSubmit(true);
                    }}>
                    Submit
            </div>
            
        </>
    );
}