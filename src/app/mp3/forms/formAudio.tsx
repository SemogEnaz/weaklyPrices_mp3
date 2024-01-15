"useClient"

import { useEffect, useState } from 'react';
import { formOptions, checkboxOptions,
    makeCheckboxsRaw, makeCheckboxes, makeDependingCheckboxes } from "./checkbox";
import LoadingForm from './formLoading';

export default function AudioForm({ url, title }: { url: string, title: string }) {

    const [audioOptions, setAudioOptions] = useState(() => {
        return ({
            'format': '',
            'thumbnail': ''
        });
    });
    const states = {
        options: audioOptions,
        setOptions: setAudioOptions
    };

    const [hasFormat, setHasFormat] = useState(false);
    const [isSubmit, setSubmit] = useState(false);
    const [fileName, setFileName] = useState('');
    const [loadingProps, setLoading] = useState(() => ({
        isLoading: false,
        message: ''
    }));

    useEffect(() => {

        setHasFormat(audioOptions['format'] != '');

    }, [audioOptions['format'], hasFormat]);

    useEffect(() => {

        if(!isSubmit) return;

        const getAudioParam = () => {
            const isAudio = '&isAudio=true';
            const fileType = 'format;' + audioOptions['format'];
            const thumbnail = 'thumbnail;' + audioOptions['thumbnail'];
    
            return isAudio + '&options=' + encodeURIComponent(fileType + ';' + thumbnail);
        }

        let apiUrl = '/api/mp3/downloadVideo?';
        apiUrl += `url=${encodeURIComponent(url)}`;

        let apiParam = getAudioParam();
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
            } finally {
                setLoading({
                    isLoading: false,
                    message: ''
                });
            }
        };
    
        fetchData();
        setSubmit(false);

    }, [isSubmit]);

    useEffect(() => {

        if (fileName == '') return;

        const deleteContent = () => {
            fetch(`api/mp3/deleteVideo?fileName=${fileName}`);
        };
    
        const downloadContent = () => {
    
            setLoading(prev => ({
                isLoading: true,
                message: 'Generating Link'
            }));

            const fileLink = `/mp3/downloads/${fileName}`;
        
            const a = document.createElement('a');
            a.href = fileLink;
            a.download = title + '.' + fileName.split('.').pop();
    
            document.body.appendChild(a);
            a.click();
            a.remove();

            setLoading(prev => ({
                isLoading: false,
                message: ''
            }));
        
            setTimeout(() => {
                deleteContent();
            }, 10 * 60000);
        };

        downloadContent();
        setFileName('');

    }, [fileName]);

    const format = makeCheckboxsRaw(
        ['.flac', '.mp3', '.wav', '[best]'],    // contents
        ['flac', 'mp3', 'wav', '0'],            // values
        'format');                              // attribute
    const formatComponent = makeCheckboxes(
        format, states);

    const embed = makeCheckboxsRaw(
        ['Embeded'],
        ['embed'],
        'thumbnail');
    const embedComponent = makeDependingCheckboxes(
        embed, states, hasFormat);

    const download = makeCheckboxsRaw(
        ['Download'],
        ['write'],
        'thumbnail');
    const downloadComponent = makeCheckboxes(
        download, states);

    if (loadingProps.isLoading)
        return <LoadingForm message={loadingProps.message}/>

    return (
        <>
            {formOptions(
                'File Formats:', checkboxOptions(formatComponent))}

            <div className="form-options">
                <div>Thumbnail:</div>
                <div className="checkbox-options">
                    {embedComponent}
                    {downloadComponent}
                </div>
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