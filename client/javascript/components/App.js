import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import routes from "../../routes";

const App = () => {
    return (
        <MuiThemeProvider>
            <div>
                <Link to={"/"}>Home</Link><br/>
                <Link to={"/about"}>About</Link><br/>
                <Link to={"/courses"}>courses redirect</Link>
                <Switch>
                    {
                        routes.map( (route, i) => (
                            <Route {...route} key={i}/>
                        ))
                    }
                </Switch>
            </div>
        </MuiThemeProvider>
    );
};

export default App;
