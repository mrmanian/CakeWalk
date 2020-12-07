import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Content from './Content';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>,
  rootElement,
);
