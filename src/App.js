import React, {useEffect, useState} from 'react';
import {createMuiTheme,ThemeProvider} from "@material-ui/core/styles";
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {grey, red} from "@material-ui/core/colors";
import PublicMain from "./components/public/PublicMain";
import PrivateMain from "./components/app/PrivateMain";
import Login from "./components/app/auth/Login";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import AdminMain from "./components/admin/AdminMain";
import EmailVerification from "./components/app/auth/EmailVerification";

const axios = require("axios")

const theme = createMuiTheme({
    palette: {
        primary: {
            main: red[700]
        },
        secondary: {
            main: grey[400]
        }
    },
    text: {

    }
})

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        axios.get("/api/v1/user/auth").then(resp => {
            setIsAuthenticated(true)
        }).catch(resp => {
            setIsAuthenticated(false)
            console.log("Authentication failed. Response:")
            console.log(resp)
        })
    }, [])

    if(isAuthenticated === null) {
        return (
            <>Loading...</>
        )
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route exact path="/app/login">
                            {isAuthenticated ? <Redirect to="/app/dashboard" /> : <Login dialog={"login"} setIsAuthenticated={setIsAuthenticated} />}
                        </Route>
                        <Route exact path="/app/register">
                            {isAuthenticated ? <Redirect to="/app/dashboard" /> : <Login dialog={"register"} setIsAuthenticated={setIsAuthenticated} />}
                        </Route>
                        <Route exact path="/app/verify/:token">
                            <EmailVerification />
                        </Route>
                        <Route path="/admin">
                            {isAuthenticated ? <AdminMain /> : <Login dialog={"login"} setIsAuthenticated={setIsAuthenticated} />}
                        </Route>
                        <Route path="/app">
                            <PrivateMain isAuthenticated={isAuthenticated}/>
                        </Route>
                        <Route path="/">
                            <PublicMain isAuthenticated={isAuthenticated}/>
                        </Route>
                    </Switch>
                </Router>
            </ThemeProvider>
        </MuiPickersUtilsProvider>

    );
}