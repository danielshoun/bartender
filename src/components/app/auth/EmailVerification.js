import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";

const axios = require('axios')

export default function EmailVerification() {
    const [verified, setVerified] = useState(null)
    const [countdown, setCountdown] = useState(3)
    const history = useHistory()

    let {token} = useParams()

    useEffect(() => {
        axios.post("/api/v1/user/verify?token=" + token).then(resp => {
            console.log("RESPONSE CODE: " + resp.status)
            if (resp.status === 200) {
                setVerified(true)
            }
            else {
                setVerified(false)
            }
        }).catch(resp => {
            console.log("RESPONSE: " + resp)
            setVerified(false)
            console.log(resp)
        })
    },[token])

    useEffect(() => {
        setInterval(() => setCountdown(countdown - 1), 1000)
    }, [countdown])

    if(verified === null) {
        return (
            <>Waiting</>
        )
    }
    else if(verified === true) {

        if(countdown === 0) {
            history.push("/app/login")
        }

        return(
            <>Success! Redirecting to login page in {countdown}...</>
        )
    }
    else if (verified === false) {
        return(
            <>Error while attempting to verify email. Please try again.</>
        )
    }
}