import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryParamProvider } from 'use-query-params';
import { BrowserRouter, Route } from 'react-router-dom';
import { Plugins, ToastContainer } from '@ahaui/react';
import { ahaPlugins } from '@ooo-booking/commons/utils';
import configureStore from 'store/configureStore';
import App from 'components/App';

import '@ahaui/css/dist/index.min.css';

// custom.css should be imported the last
import 'assets/styles/custom.css';

const store = configureStore({});

Plugins.loadPlugin(ahaPlugins.LogoAssetsPlugin);
Plugins.loadPlugin(ahaPlugins.AvatarAssetsPlugin);
Plugins.loadPlugin(ahaPlugins.EmptyStateAssetsPlugin);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
        <QueryParamProvider ReactRouterRoute={Route}>
          <App />
        </QueryParamProvider>
      </BrowserRouter>
      <ToastContainer
        draggable={false}
        position="bottom-right"
      />
    </Provider>,
    document.getElementById('root'),
  );
};

render();
