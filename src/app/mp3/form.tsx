"use client"

import { useEffect, useState } from "react";
import AudioForm from '@/app/mp3/formAudio';
import VideoForm from "@/app/mp3/formVideo";

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
            'thumbnail': ''
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
            const thumbnail = 'thumbnail;' + audioOptions['thumbnail'];
    
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

    const Form = () => {

        const placeholder = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        return (

            <div className="form">

                <Title title={title} />

                <div className="flex items-center bg-blue-900 rounded-md p-3 drop-shadow-2xl mb-[30px]">
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

                {isAudio ? 
                <AudioForm audioOptions={audioOptions} setAudioOptions={setAudioOptions} /> :
                <VideoForm videoOptions={videoOptions} setVideoOptions={setVideoOptions} />}

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