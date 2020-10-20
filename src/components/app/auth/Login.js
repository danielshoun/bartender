import React from 'react';
import Paper from "@material-ui/core/Paper";
import LoginDialog from "./LoginDialog";
import RegDialog from "./RegDialog";
import {Redirect, Route, Switch} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    loginDialogContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%"
    },
    loginDialogPaper: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: theme.spacing(6),
        padding: theme.spacing(1),
        width: theme.spacing(32)
    }
}))

export default function Login(props) {
    const classes = useStyles()

    return (
        <div className={classes.loginDialogContainer}>
            <Paper className={classes.loginDialogPaper}>
                <Switch>
                    <Route exact path="/app/login">
                        {props.isAuthenticated ? <Redirect to="/app/dashboard" /> : <LoginDialog setIsAuthenticated={props.setIsAuthenticated}/>}
                    </Route>
                    <Route exact path="/app/register">
                        {props.isAuthenticated ? <Redirect to="/app/dashboard" /> : <RegDialog setIsAuthenticated={props.setIsAuthenticated}/>}
                    </Route>
                </Switch>
            </Paper>
        </div>
    )
}