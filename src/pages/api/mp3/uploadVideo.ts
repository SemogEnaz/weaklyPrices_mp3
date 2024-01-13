import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { fileName } = req.query;

    const decodedFileName = decodeURIComponent(fileName);
    console.log(`Requesting download for: ${decodedFileName}`);
    const filePath = path.resolve('./downloads/mp3', decodedFileName)

    fs.stat(filePath, (err, stat) => {
        if (err) {
            console.error(err);
            return res.status(400).send('File not found');
        }

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(path.basename(filePath)));
        res.setHeader('Content-Length', stat.size);

        const readStream = fs.createReadStream(filePath);
        console.log('Starting download')
        readStream.pipe(res);
        console.log('Download done!')
    });
}