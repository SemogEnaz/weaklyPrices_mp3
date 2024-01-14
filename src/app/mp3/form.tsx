"use client"

import { useEffect, useState } from "react";

import '@/app/mp3/form.css'
import '@/app/mp3/checkbox.css'
import Image from 'next/image';

export default function SubmissionForm() {

    const [title, setTitle] = useState('');
    const [isAudio, setAudio] = useState(true);
    const [isRevealed, setRevealed] = useState(false);
    const [url, setUrl] = useState('');
    const [isSubmit, setSubmit] = useState(false);
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
            'thumbnail': '',    // embed, download
            'subtitles': '',    // embed, none
            'chapters': '',     // write, none
            'sponsor': '',      // mark, remove
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

        if(!isSubmit) return;

        const getAudioOptions = () => {
            const isAudio = '&isAudio=true';
            const fileType = 'format;' + audioOptions['format'];
            const thumbnail = 'thumbnail;' + audioOptions['thumbnailOption'];
    
            return isAudio + '&options=' + encodeURIComponent(fileType + ';' + thumbnail);
        }

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

        let apiParam = isAudio ? getAudioOptions() : getVideoOptions();
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
        ];

        const values = [
            'mkv', 'mp4', 'best'
        ];

        const formats = make_checkboxRaw(contents, values);

        const fileFormatComponent = () => {
            return (
                <div className="checkbox-options">
                    {formats.map(option => (
                        <Checkbox
                            key={option.value}
                            content={option.content}
                            value={option.value}
                            attribute={'format'} />
                    ))}
                </div>
            );
        };

        const subtitles = make_checkboxRaw(
            ['Subtitles'], ['embed']
        );

        const subtitleComponent = () => {
            return (
                <>
                    {subtitles.map(option => (
                        <Checkbox
                            key={option.value}
                            content={option.content}
                            value={option.value}
                            attribute={'subtitles'} />
                    ))}
                </>
            );
        };

        const chapters = make_checkboxRaw(
            ['Chapters'], ['embed']
        );

        const chapterComponent = () => {
            return (
                <>
                    {chapters.map(option => (
                        <Checkbox
                            key={option.value}
                            content={option.content}
                            value={option.value}
                            attribute={'chapters'} />
                    ))}
                </>
            );
        };

        const sponsor = make_checkboxRaw(
            ['Mark', 'Remove'],
            ['mark', 'remove']
        );

        const sponsorComponent = () => {
            return (
                <div className="checkbox-options">
                    {sponsor.map(option => (
                        <Checkbox
                            key={option.value}
                            content={option.content}
                            value={option.value}
                            attribute={'sponsor'} />
                    ))}
                </div>
            );
        };

        return (
            <>
                <div className="form-options">
                    <div>File Formats:</div>
                    {fileFormatComponent()}
                </div>
                <div className="
                    flex flex-col sm:flex-row
                    justify-between 
                    items-center 
                    h-[250px] sm:h-fit">
                    <div className="form-options small">
                        <div>Write to Video:</div>
                        <div className="checkbox-options">
                            {subtitleComponent()}
                            {chapterComponent()}
                        </div>
                    </div>
                    <div className="form-options small">
                        <div>Sponsor Handling</div>
                        {sponsorComponent()}
                    </div>
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

                <div className="flex justify-center mt-[150px] cursor-crosshair">
                    <Image
                        src="https://jipel.law.nyu.edu/wp-content/uploads/2023/03/image-768x386.png"
                        alt="YOU WOULDN'T DOWNLOAD A CAR!!!"
                        width={400}
                        height={200} />
                </div>
                

            </div>
        );
    };

    const LoadingForm = ({ message }) => {
        return (
            <div className="form loading">
                <div className="captains-wheel min-width-[70px]">
                    <Image
                        src={'/mp3/assets/captainsWheel.svg'}
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

    if (loadingData.isLoading) return <LoadingForm message={loadingData.message}/>

    return  <Form /> ;
}