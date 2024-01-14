import { formOptions, makeCheckboxsRaw, makeCheckboxes } from "./checkbox";

export default function AudioForm({ audioOptions, setAudioOptions }: any) {

    const states = {
        options: audioOptions,
        setOptions: setAudioOptions
    };

    const format = makeCheckboxsRaw(
        ['.flac', '.mp3', '.wav', '[best]'],    // contents
        ['flac', 'mp3', 'wav', '0'],            // values
        'format');                              // attributes
    const formatComponent = makeCheckboxes(
        format, states);

    const thumbnail = makeCheckboxsRaw(
        ['Embeded', 'Download'],
        ['embed', 'write'],
        'thumbnail');
    const thumbnailComponent = makeCheckboxes(
        thumbnail, states);

    return (
        <>
            {formOptions('File Formats:', formatComponent)}
            {formOptions('Thumbnail:', thumbnailComponent)}
        </>
    );
}