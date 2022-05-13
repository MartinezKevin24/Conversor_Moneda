import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.scss";
import App from './App';
import storefn from "./store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from 'redux-persist/integration/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = storefn();
const persist = persistStore(store)

root.render(
  <React.StrictMode>
      <Provider store={store}>
          {/*<PersistGate persistor={persist}>*/}
              <App />
          {/*</PersistGate>*/}
      </Provider>
  </React.StrictMode>
);
