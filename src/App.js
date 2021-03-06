import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './main/Main';
import Register from './register/Register';
import Qna from './qna/Qna';
import Result from './result/Result';
import Admin from './admin/Admin';
import "./App.css";
import { UserContext } from './user-context';

export default function App() {

  const defaultUser = {
    age: 'default',
    job: 'default',
    sex: 'default'
  };

  const updateValue = (key, val) => {
    setUser({...user, [key]: val});
  }

  const [user, setUser] = useState(defaultUser);

  const userSettings = {
    user: user,
    updateValue
  };

  return (
    <UserContext.Provider value={userSettings}>
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
    </UserContext.Provider>
  );
}