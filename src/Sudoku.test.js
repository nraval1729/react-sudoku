import React from 'react';
import ReactDOM from 'react-dom';
import Sudoku from './Sudoku';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Sudoku />, div);
  ReactDOM.unmountComponentAtNode(div);
});
