// Styles
import "./stylesheets/app.scss";

import React from "react";
import { render } from "react-dom";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import routes from "./routes";

const App = () => {
    return (
        <div>
            {/*
            <Link to={"/"}>Home</Link><br/>
            <Link to={"/about"}>About</Link><br/>
            <Link to={"/courses"}>courses redirect</Link>
            */}
            <Switch>
                {
                    routes.map( route => (
                        <Route {...route} key={route.name}/>
                    ))
                }
            </Switch>
        </div>
    );
};

render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
),document.getElementById("app"));
