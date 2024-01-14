import { formOptions, makeCheckboxsRaw, makeCheckboxes } from "./checkbox";

export default function VideoForm({ videoOptions, setVideoOptions }: any) {

    const state = {
        options: videoOptions,
        setOptions: setVideoOptions
    };

    const formats = makeCheckboxsRaw(
        ['.mkv', '.mp4', '[best]'],
        ['mkv', 'mp4', 'best'],
        'format');
    const formatComponent = makeCheckboxes(
        formats, state);
    
    const subtitles = makeCheckboxsRaw(['Subtitles'], ['embed'], 'subtitles');
    const chapters = makeCheckboxsRaw(['Chapters'], ['embed'], 'chapters');
    const subsNchapsComponent = makeCheckboxes(
        [...subtitles, ...chapters], state);

    const sponsor = makeCheckboxsRaw(
        ['Mark', 'Remove'],
        ['mark', 'remove'],
        'sponsor');
    const sponsorComponent = makeCheckboxes(
        sponsor, state);

    return (
        <>
            {formOptions('File Formats:', [formatComponent])}
            <div className="one-line-options">
                <div className="form-options">
                    <div>Write to Video:</div>
                    {subsNchapsComponent}
                </div>
                {formOptions('Sponsor Handling', [sponsorComponent])}
            </div>
            
        </>
    );
}