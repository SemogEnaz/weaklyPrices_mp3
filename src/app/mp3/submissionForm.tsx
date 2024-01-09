"use client"

import { useState } from "react";

export default function SubmissionForm() {

    const [isAudio, setAudio] = useState(true);
    const [submit, setSubmit] = useState(false);

    function submitForm() {
        setSubmit(true);
    }

    function reset() {
        setSubmit(false);
    }



    let body = null;

    if (!submit)
        body = 
        <div 
            className='mt-10 bg-blue-900 radius-10 text-center' 
            onClick={() => {
                setSubmit(true);
            }}>
                Click Me! ;)
        </div>
    else
        body = 
        <div className='col-center'>
            Success! Does nothing...
            <button 
                onClick={() => {
                    setSubmit(false);
                }}>
                    click to Return (*____* )
            </button>
        </div>

    return (

        <div className="mt-10">

            placeholder for submission form

            {body}

        </div>
    );
}