import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import routes from "../../routes";

const App = () => {
    return (
        <MuiThemeProvider>
            <div>
                <AppBar title="GG Panel" iconClassNameRight="muidocs-icon-navigation-expand-more"></AppBar>
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
