import React from 'react';
import PublicMenu from "./PublicMenu";
import {Route, Switch} from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Pricing from "./Pricing";
import Contact from "./Contact";

export default function PublicMain(props) {
    return(
        <>
        <PublicMenu isAuthenticated={props.isAuthenticated}/>

        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/about">
                <About />
            </Route>
            <Route exact path="/pricing">
                <Pricing />
            </Route>
            <Route exact path="/contact">
                <Contact />
            </Route>
        </Switch>
        </>
    )
}