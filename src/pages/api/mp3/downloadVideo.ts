import { exec } from 'child_process';

export default function handler(req, res) {
    const { url, isAudio, options } = req.query;

    if(!url) return res.status(400).json(
        { error: 'URL is required'});

    const command = 'yt-dlp ';
    const args = getArgs(isAudio, options);

    exec(command + args + decodeURIComponent(url), (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            return res.status(400).json(null);
        }
        // Need to use this to identify the download for a specific instance.
        console.log('download success');
        return res.status(200).json({ 'status': 'true' });
    });
}

function getArgs(isAudio: string, options: string) {
    if (isAudio == 'true')
        return getAudioArgs(decodeURIComponent(options));

    return getVideoArgs(decodeURIComponent(options));
}

// format;[flac, mp3, wav, best];thumbnail;[embed,download]
function getAudioArgs(options: string) {

    const args = options.split(';');

    if (args.length > 4) throw new Error("argument error in audio format")

    let fileFormat = args[1];
    fileFormat = 
        fileFormat == '0' ? '--audio-quality 0' : `--audio-format ${fileFormat}`;
    const thumbnail = args[3];

    return `-x ${fileFormat} --${thumbnail}-thumbnail --add-metadata -o "./downloads/mp3/%(title)s.%(ext)s" `;
}

function getVideoArgs(options: string) {

    const bestVideoFormat = (format: string) => {
        if (format == "best") 
            return '';

        return `-f 'bestvideo[ext=${format}]+bestaudio[ext=${format}]/best'`
    }

    const args = options.split(';');
    console.log(args);

    if (args.length > 2) throw new Error("argument error in audio format")

    let fileFormat = args[1];
    fileFormat = bestVideoFormat(fileFormat);

    return `${fileFormat} --embed-thumbnail --add-metadata -o "./downloads/mp3/%(title)s.%(ext)s" `;

}