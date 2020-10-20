import React, {useEffect, useState} from 'react';
import {Route, Switch, useHistory} from "react-router-dom";
import AdminMenu from "./AdminMenu";
import SchoolManager from "./SchoolManager";

const axios = require('axios')

export default function AdminMain() {
    const [isAdmin, setIsAdmin] = useState(null)

    const history = useHistory()

    useEffect(() => {
        axios.get("/api/v1/user/self").then(resp => {
            if(resp.data.isWebsiteAdmin === true) {
                console.log("User is admin.")
                setIsAdmin(true)
            }
            else {
                setIsAdmin(false)
            }
        }).catch(resp => {
            setIsAdmin(false)
        })
    }, [])

    if(isAdmin === null) {
        return (
            <>Loading...</>
        )
    }
    else if(isAdmin === false) {
        history.push("/app/dashboard")
    }
    else {
        return (
            <>
                <AdminMenu />

                <Switch>
                    <Route exact path="/admin/schools">
                        <SchoolManager />
                    </Route>
                </Switch>
            </>
        )
    }
}