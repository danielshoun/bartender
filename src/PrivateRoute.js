import React from 'react';
import './App.css';
import {Route, Redirect} from "react-router-dom";

const axios = require('axios');

const auth = {
    isAuthenticated: false,
    user: null,
    authenticate(cb) {
        axios.get("localhost:8080/api/v1/user/auth").then(r => {
            if (r.status === 200) {
                this.isAuthenticated = true
                this.user = r.data
            }
        })
    }
}

export default function PrivateRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({location}) =>
                auth.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                        pathname: "/login",
                        state: {from: location}
                        }}
                />
                )
            }
        />
    );
}