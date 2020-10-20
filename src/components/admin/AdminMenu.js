import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from "@material-ui/core/Grid";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from '@material-ui/core/Toolbar';
import logo from '../../images/btio.png'
import {useHistory} from "react-router-dom"
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

export default function AdminMenu(props) {
    const classes = useStyles()
    const history = useHistory()

    const handleChange = (event, value) => {
        if(value === "schools") {
            history.push("/admin/schools")
        }
        if(value === "organizations") {
            history.push("/admin/organizations")
        }
        if(value === "users") {
            history.push("/admin/users")
        }
    }

    return(
        <AppBar position = "static" className={classes.appBar}>
            <Toolbar>
                <Grid justify={"space-between"} container>
                    <Grid className={classes.navLogo} xs={1} item>
                        <img src={logo}  alt="Bartender logo" className={classes.navLogo}/>
                    </Grid>
                    <Grid xs={3} item>
                        <Tabs className={classes.navTabContainer} textColor={"primary"} onChange={handleChange}>
                            <Tab label="Schools" value={"schools"}/>
                            <Tab label="Organizations" value={"organizations"}/>
                            <Tab label="Users" value={"users"}/>
                        </Tabs>
                    </Grid>
                    <Grid xs={1} item>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}