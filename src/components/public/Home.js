import React from 'react';
import logo from '../../images/logo.png'
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    homeLogo: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "10%"
    },
    homeText: {
        alignText: "center",
        marginTop: "16px"
    }
})

export default function Home() {
    const classes = useStyles()

    return (
        <>
            <img src={logo} className={classes.homeLogo} alt="Bartendr Logo Large" />
            <Typography className={classes.homeText} align="center">Our public website is under construction. Bartendr is currently only available to the USF COP.<br/>
            Please login, register, or go to your dashboard by clicking <Link to="/app/login">here</Link> or by using the buttons in the top right.</Typography>
        </>
    )
}