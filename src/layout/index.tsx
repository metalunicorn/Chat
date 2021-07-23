import {
  Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../store/index';
import PageAuthorization from '../pages/pageAuthorization';
import PageChat from '../pages/pageChat';
import { createBrowserHistory } from 'history';
  
export const NotFound = ():JSX.Element => <div className="Error">404</div>;
export const Content: React.FC = () => {
  const history = createBrowserHistory();
  return (
    <>
      <Provider store={store}>
        <Router history={history}>
          {localStorage.authToken ? (
            <Redirect from="/" to="/chat" />
          ) : (
            <Redirect from="/" to="/auth" />
          )}
          <main>
            <Switch>
              <Route path="/auth" render={() => <PageAuthorization />} exact />
              <Route path="/chat" render={() => <PageChat />} exact />
              <Route component={NotFound} />
            </Switch>
          </main>
        </Router>
      </Provider>
    </>
  );
};
