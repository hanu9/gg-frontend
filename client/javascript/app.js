import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./store";

import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

render((
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
),document.getElementById("app"));
