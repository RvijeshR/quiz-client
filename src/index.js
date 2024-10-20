import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Import your store
import App from './App';
import './index.css'; // If you have any global styles

ReactDOM.render(
  <Provider store={store}> {/* Wrap the app with Provider */}
    <App />
  </Provider>,
  document.getElementById('root')
);
