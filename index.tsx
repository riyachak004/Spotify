
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return <h1>Hello, TypeScript with React!</h1>;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
