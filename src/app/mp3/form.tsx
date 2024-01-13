"use client"

import { useEffect, useState } from "react";

import '@/app/mp3/form.css'
import '@/app/mp3/checkbox.css'
import Image from 'next/image';

export default function SubmissionForm() {

    const [title, setTitle] = useState('');
    const [isRevealed, setRevealed] = useState(false);
    const [url, setUrl] = useState('');
    const [isSubmit, setSubmit] = useState(false);
    const [isAudio, setAudio] = useState(true);
    const [loadingData, setLoading] = useState(() => ({
        isLoading: false,
        message: ''
    }));
    const [audioOptions, setAudioOptions] = useState(() => {
        return ({
            'format': '',
            'thumbnailOption': ''
        });
    });
    const [videoOptions, setVideoOptions] = useState(() => {
        return ({
            'format': '',
            'subtitles': '',
            'thumbnailOption': ''
            //sponsor block
            //chapters
        })
    })
    const [fileName, setFileName] = useState('');

    useEffect(() => {

        const isYtVideo = (url: string) => {
            const urlStart = 'https://www.youtube.com/watch?v=';
            const urlStartMoble = 'https://youtu.be/'
            return url.includes(urlStart) || url.includes(urlStartMoble);
        }
    
        const isYtPlaylist = (url: string) => {
            const urlStart = 'https://youtube.com/playlist?list=';
            const urlStartwww = 'https://www.youtube.com/playlist?list=';
            return url.includes(urlStart) || url.includes(urlStartwww);
        }
    
        const isYtUrl = (url: string) => {
            return isYtVideo(url) || isYtPlaylist(url);
        }

        const clean = (url: string) => {
            return !url.includes(';') && !url.includes(' ');
        }

        if (!isYtUrl(url) && !clean(url)) {
            return;
        }

        fetch(`/api/mp3/getVideoTitle?url=${url}`)
            .then(response => response.json())
            .then(data => {
                setTitle(data.title);
            })
            .catch(error => {
                console.error('error fetching data: ', error);
            })

        setRevealed(true);

    }, [url]);

    useEffect(() => {

        const getAudioOptions = () => {
            const isAudio = '&isAudio=true';
            const fileType = 'format;' + audioOptions['format'];
            const thumbnail = 'thumbnail;' + audioOptions['thumbnailOption'];

            return isAudio + '&options=' + encodeURIComponent(fileType + ';' + thumbnail);
        }

        const getVideoOptions = () => {
            const isAudio = '&isAudio=false';
            const fileType = 'format;' + videoOptions['format'];
            //const thumbnail = 'thumbnail;' + audioOptions['thumbnailOption'];

            return isAudio + '&options=' + encodeURIComponent(fileType);
        }

        let apiUrl = '/api/mp3/downloadVideo?';
        apiUrl += `url=${encodeURIComponent(url)}`;

        let apiParam = isAudio ? getAudioOptions() : getVideoOptions();
        apiUrl += apiParam;
        console.log(apiParam);

        async function fetchData() {

            setLoading((prev) => ({
                isLoading: true,
                message: 'Downloading Video'
            }));

            try {
                const response = await fetch(apiUrl)
                const data = await response.json();
                
                if (data.status == 'true')
                    setFileName('/downloads/' + title);

                setLoading((prev) => ({
                    isLoading: false,
                    message: ''
                }));
            } catch (error) {
                console.error('Fetch error: ', error);
            }
        }

        if (isSubmit) {
            console.log('starting download');
            fetchData();
            console.log('submitted');
        }

    }, [isSubmit]);

    const Title = ({ title }) => {

        if (title == '')
            return (
                <div className='form-title'></div>
            );
    
        return (
            <div className={`form-title ${isRevealed ? '' : 'show'}`}>
                {title}
            </div>
        );
    }

    function make_checkboxRaw(contents: string[], values: string[]) {
        const checkboxes = [];

        if (contents.length != values.length) throw new Error("error contents != values");

        for (let i = 0; i < contents.length; i++) {
            checkboxes.push({ 
                content: contents[i],
                value: values[i]
            });
        }

        return checkboxes;
    }

    const Checkbox = ({ content, value, attribute }) => {

        const isChecked = isAudio ? 
            audioOptions[attribute] == value: 
            videoOptions[attribute] == value;

        const handleClick = () => {
            const updateOption = (options) => ({
                ...options,
                [attribute]: options[attribute] == value ? '' : value
            });

            if (isAudio)
                setAudioOptions(updateOption);
            else
                setVideoOptions(updateOption)
        }

        return (
            <div className="checkbox">

                <div 
                    className={`box  ${isChecked ? 'checked' : ''}`}
                    onClick={handleClick}></div>

                <div className="label">{content}</div>

            </div>
        );
    };

    const AudioForm = () => {

        let contents = [
            '.flac', '.mp3', '.wav', '[best]'
        ];

        let values = [
            'flac', 'mp3', 'wav', '0'
        ];

        const fileFormats = make_checkboxRaw(contents, values);

        const fileFormatCheckboxes = 
            <div className="checkbox-options">
                {fileFormats.map((checkboxItem) => {
                    return (
                        <Checkbox
                            key={checkboxItem.value}
                            content={checkboxItem.content}
                            value={checkboxItem.value}
                            attribute={'format'} />
                    )
                })}
            </div>

        contents = [
            'Embeded'//, 'Download'
        ];

        values = [
            'embed'//, 'write'
        ];

        const thumbnailOptions = make_checkboxRaw(contents, values);

        const thumbnailOptionsComponent = 
            <div className="checkbox-options">
                {thumbnailOptions.map(option => {
                    return (
                        <Checkbox
                            key={option.content}
                            content={option.content}
                            value={option.value}
                            attribute={'thumbnailOption'} />
                    );
                })}
            </div>

        return (
            <>
                <div className="form-options">
                    <div>File Formats:</div>
                    {fileFormatCheckboxes}
                </div>
                <div className="form-options">
                    <div>Thumbnail:</div>
                    {thumbnailOptionsComponent}
                </div>
            </>
        );
    }

    const VideoForm = () => {

        const contents = [
            '.mkv', '.mp4', '[best]'
        ]

        const values = [
            'mkv', 'mp4', 'best'
        ]

        const checkboxes = make_checkboxRaw(contents, values);

        const fileFormatComponent = 
            <div className="checkbox-options">
                {checkboxes.map(options => {
                    return (
                        <Checkbox
                            key={options.value}
                            content={options.content}
                            value={options.value}
                            attribute={'format'} />
                    );
                })}
            </div>

        return (
            <>
                <div className="form-options">
                    <div >File Formats:</div>
                    {fileFormatComponent}
                </div>
            </>
        );
    }

    const Form = () => {

        const placeholder = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        return (

            <div className="form">

                <Title title={title} />

                <div className="flex items-center bg-blue-900 rounded-md p-3 drop-shadow-2xl">
                    <div className="text-xl text-white">url:</div>
                    <input 
                        type="text"
                        value={url}
                        placeholder={placeholder}
                        onChange={(inputEvent) => {
                            setUrl(inputEvent.target.value);
                        }}
                        className="url-input drop-shadow-md" />
                </div>

                <div className="content-types">

                    <div 
                        className={`content-type-button ${isAudio ? 'show-button' : ''}`}
                        onClick={() => {
                            setAudio(true);
                        }}>Audio</div>

                    <div 
                        className={`content-type-button ${isAudio ? '' : 'show-button'}`}
                        onClick={() => {
                            setAudio(false);
                        }}>Video</div>

                </div>

                {isAudio ? <AudioForm /> : <VideoForm />}

                <div
                    className='submition-button' 
                    onClick={() => {
                        setSubmit(true);
                    }}>
                    Submit
                </div>

            </div>
        );
    };

    const LoadingForm = ({ message }) => {
        return (
            <div className="form loading">
                <div className="captains-wheel min-width-[70px]">
                    <Image
                        src={'/mp3/captainsWheel.svg'}
                        alt="Captains Wheel"
                        width={100}
                        height={100}
                        style={{
                            width: '200px',
                            height: 'auto',
                        }}
                    />
                </div>
                <div className="loading-text">
                    {message}
                </div>
            </div>
        );
    }

    const CompletedForm = () => {

        const getExtension = () => {

            if (isAudio) 
                return '.' + (
                    audioOptions['format'] == '0' ? 'opus' : audioOptions['format']
                    );
            
            return '.' + (
                videoOptions['format'] == 'best' ? 'mkv' : videoOptions['format']
            );
        };

        const download = () => {
            const param = `fileName=${
                encodeURIComponent(
                    title + getExtension()
                )
            }`;

            setLoading(prev => ({
                isLoading: true,
                message: 'Generating Link'
            }));

            fetch(`/api/mp3/uploadVideo?${param}`)
                .then(response => response.blob())
                .then(blob => {
                    // Create a blob link to download
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = title + getExtension(); // or any other filename
                    document.body.appendChild(a); // Append the anchor to body
                    a.click();
                    a.remove(); // Clean up
                    window.URL.revokeObjectURL(url); // Release blob URL
                })
                .then(() => setLoading(prev => ({
                    isLoading: false,
                    message: ''
                })));
        }

        return (
            <div className='form completed'>

                <div 
                    className="submition-button"
                    onClick={() => {
                        setSubmit(false);
                    }}>
                    Back
                </div>

                <div>
                    Success!
                </div>

                <div 
                    className="submition-button"
                    onClick={() => {
                        download();
                        setSubmit(false);
                    }}>
                        Download
                </div>

            </div>
        );
    };

    //

    if (loadingData.isLoading) return <LoadingForm message={loadingData.message}/>

    return  isSubmit ? <CompletedForm /> : <Form /> ;
}