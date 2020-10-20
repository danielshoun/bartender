import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from '@material-ui/core/Toolbar';
import logo from '../../images/btio.png'
import {useHistory} from "react-router-dom"
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    appBar: {
        background: "transparent",
        boxShadow: "none",
        marginBottom: "64px"
    },
    navLogo: {
        height: "48px",
        width: "auto"
    },
    navTabContainer: {
        textColor: "primary"
    },
    navButton: {
        height: "48px"
    }
})

export default function PublicMenu(props) {
    const classes = useStyles()
    const history = useHistory()

    const handleChange = (event, value) => {
        if(value === "home") {
            history.push("/")
        }
        if(value === "about") {
            history.push("/about")
        }
        if(value === "pricing") {
            history.push("/pricing")
        }
        if(value === "contact") {
            history.push("/contact")
        }
    }

    return(
        <AppBar position = "static" className={classes.appBar}>
            <Toolbar>
                <Grid justify={"space-between"} container>
                    <Grid className={classes.navLogo} xs={1} item>
                        <img src={logo}  alt="Bartender logo" className={classes.navLogo}/>
                    </Grid>
                    <Grid xs={4} item>
                        <Tabs className={classes.navTabContainer} textColor={"primary"} onChange={handleChange}>
                            <Tab label="Home" value={"home"}/>
                            <Tab label="About" value={"about"}/>
                            <Tab label="Pricing" value={"pricing"}/>
                            <Tab label="Contact" value={"contact"}/>
                        </Tabs>
                    </Grid>
                    <Grid xs={1} item>
                        <Box display="flex" flexDirection="row-reverse">
                            {props.isAuthenticated ? <Button
                                className={classes.navButton}
                                variant="contained"
                                color="primary"
                                onClick={(event) => {history.push("/app/dashboard")}}>Dashboard</Button> :
                            <Button
                                className={classes.navButton}
                                variant="contained"
                                color="primary"
                                onClick={(event) => {history.push("/app/login")}}>Login</Button>}
                        </Box>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}