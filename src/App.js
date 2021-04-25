import React from 'react'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 
import { StateMachineProvider, createStore } from "little-state-machine";
import MainPage from './pages/MainPage'; 
import InfoPage from './pages/InfoPage';
import QuestionPage from './pages/QuestionPage';
import ResultPage from './pages/ResultPage';
import "./styles/css/App.css";

createStore({
  data: {
    sex: '',
    age: '',
    occupation: '',
    response: '',
    foodInfo: [],
    keywords: [],
    rules: [],
  }
});

export default function App() { 
  return (
    <StateMachineProvider>
      <Router>
        <Switch>
          <Route exact path='/main' component={MainPage} />
          <Route exact path='/info' component={InfoPage} />
          <Route exact path='/question' component={QuestionPage} />
          <Route exact path='/result' component={ResultPage} />
          <Route render={() => <div className='error'>"error occurred"</div>} />
        </Switch>
      </Router>
    </StateMachineProvider>
      
    ); 
  } 