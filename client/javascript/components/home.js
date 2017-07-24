import React from "react";
import Paper from 'material-ui/Paper';

const style = {
  height: 500,
  width: 400,
  textAlign: "center",
  display: "block",
  margin: "40px auto 0"
};

const Home = (props) => (
    <div>
        <Paper style={style} zDepth={1}>
            <iframe src="https://accounts-uat.paytm.com/oauth2/authorize?response_type=code&client_id=persona-test&scope=paytm&redirect_uri=http://local.paytm.com/token&theme=diy" width="400" height="470" frameBorder="0"></iframe>
        </Paper>
    </div>
);

export default Home;
