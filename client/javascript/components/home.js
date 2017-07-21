import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import MyAwesomeReactComponent from "./MyAwesomeReactComponent";

const Home = (props) => (
    <MuiThemeProvider>
        <MyAwesomeReactComponent />
    </MuiThemeProvider>
);

export default Home;
