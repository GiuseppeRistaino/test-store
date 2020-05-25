import React, {Component} from 'react';
import {Switch, Route} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Default from "./components/Default";
import Details from "./components/Details";
import Cart from "./components/Cart";

class App extends Component {
  render() {
    return (

        <React.Fragment>
          <h3>Hello from app</h3>

          <Navbar></Navbar>
            <Switch>
                <Route exact path={"/"} component={ProductList}/>
                <Route path={"/details"} component={Details}/>
                <Route path={"/cart"} component={Cart}/>
                <Route component={Default}/>
            </Switch>

        </React.Fragment>

        /* Sostituiamo con REACT
        <div className="container">
          <div className="row">
            <div className="col-6">column number one</div>
            <div className="col-6">
              <span>
                <i className="fas fa-home"/>
              </span>
            </div>
          </div>
        </div>
        */

        /*
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
         */
    );
  }
}

export default App;
