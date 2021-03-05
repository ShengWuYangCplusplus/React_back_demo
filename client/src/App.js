import React, {Component} from 'react';
import PrivateRoute from './components/PrivateRoute'
import {Route,Switch} from 'react-router-dom'
import Login from './routes/Login/index'
import Screen from './routes/Screen/index'

import Index from './routes/Index/index'
import './App.css'
import './style/reset-antd.css'
import './assets/font/iconfont.css'
class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/login' component={Login}/>
        <Route exact path='/screen' component={Screen}/>
        <PrivateRoute path='/' component={Index}/>
      </Switch>
    )
  }
}

export default App;
