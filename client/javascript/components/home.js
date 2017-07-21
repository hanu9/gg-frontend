import React from "react";

import RaisedButton from "material-ui/RaisedButton";
import AppBar from "material-ui/AppBar";

const Home = (props) => (
    <div>
        <AppBar title="Title" iconClassNameRight="muidocs-icon-navigation-expand-more"></AppBar>
        <RaisedButton label="Default"></RaisedButton>
    </div>
);

export default Home;
