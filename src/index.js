import React from 'react';
import ReactDOM from 'react-dom';
import Center from 'react-center';
import './index.css';
import Sudoku from './Sudoku';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Center><Sudoku /></Center>, document.getElementById('root'));
registerServiceWorker();
