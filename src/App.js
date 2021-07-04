import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './main/Main';
import Register from './register/Register';
import Qna from './qna/Qna';
import Result from './result/Result';
import Admin from './admin/Admin';
import "./App.css";


export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/admin' component={Admin} />
        <Route exact path='/main' component={Main} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/qna' component={Qna} />
        <Route exact path='/result' component={Result} />
        <Route render={() => <div className='error'>"error occurred"</div>} />
      </Switch>
    </Router>
  );
}