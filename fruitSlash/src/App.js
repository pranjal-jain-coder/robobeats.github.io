import React from 'react';
import './App.css';
import {AppBar} from "@material-ui/core";
import {Toolbar} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {GameControl} from "./game-control.js";

function MyAppBar(props) {
  return (
    <AppBar style={{background:'#2c3e50'}}>
      <Toolbar>
        <Typography
          variant="h6"
          style={{ marginLeft: "auto", marginRight: "auto" }}>
          Fruit Slash
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <div>
      <div className="App">
        <MyAppBar />
      </div>
      <GameControl />
    </div>
  );
}

export default App;
