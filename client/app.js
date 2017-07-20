// Styles
import "./stylesheets/app.scss";

import React from "react";
import { render } from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import MyAwesomeReactComponent from "./javascript/MyAwesomeReactComponent";

const App = () => (
    <MuiThemeProvider>
        <MyAwesomeReactComponent />
    </MuiThemeProvider>
);

render(
    <App />,
    document.getElementById("app")
);
