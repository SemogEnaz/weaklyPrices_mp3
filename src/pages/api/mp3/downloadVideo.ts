import { execSync } from 'child_process';

export default function handler(req, res) {
    const { url, isAudio, options } = req.query;

    if(!url) return res.status(400).json(
        { error: 'URL is required'});

    const getTimeCode = (codeLen: number) =>  String(Date.now()).slice(codeLen);
    const addCode = (code: string) => ` -o "./public/mp3/downloads/${code}.%(ext)s"`;

    const codeLen = 8;
    const code = getTimeCode(codeLen * -1);

    const args = getArgs(isAudio, options) + addCode(code);
    const command = `yt-dlp ${args} ${decodeURIComponent(url)}`;

    console.log(command);
    execSync(command);

    const fileName = getFileName(code);

    console.log(`File Downloaded: ${fileName}`);
    res.status(200).json({ 'fileName': fileName });
}

function getFileName(code: string) {
    const files = execSync('ls ./public/mp3/downloads/')

    return files.toString().split('\n')
        .filter(string => string.includes(code)).pop();
}

function getArgs(isAudio: string, options: string) {
    if (isAudio == 'true')
        return getAudioArgs(decodeURIComponent(options));

    return getVideoArgs(decodeURIComponent(options));
}

function getAudioArgs(options: string) {

    const args = options.split(';');

    if (args.length > 4) throw new Error("argument error in audio format")

    let fileFormat = args[1];
    fileFormat = 
        fileFormat == '0' ? '--audio-quality 0' : `--audio-format ${fileFormat}`;

    let thumbnail = args[3];
    thumbnail = thumbnail == 'embed' ? `--${thumbnail}-thumbnail` : '';

    return `-x ${fileFormat} ${thumbnail} --add-metadata `;
}

function getVideoArgs(options: string) {

    const format = (format: string) => {
        if (format == "best") 
            return '';

        return `-f 'bestvideo[ext=${format}]+bestaudio[ext=${format}]/best'`;
    };
    const embed = (option: string) => option == 'embed' ? option : '';
    const subs = (option: string) => `--${embed(option)}-subs`;
    const chapters = (option: string) => `--${embed(option)}-chapters`;
    const sponsor = (option: string) => `--sponsorblock-${option == 'mark all' ? 'mark' : 'remove all'}`;

    const args = options.split(';');

    const command = `${format(args[1])} ${args[3] == '' ? '' : subs(args[3])} ${args[5] == '' ? '' : chapters(args[5])} ${args[7] == '' ? '' : sponsor(args[7])} --embed-thumbnail --add-metadata`;
    return command;
}