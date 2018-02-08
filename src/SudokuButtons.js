import React, { Component } from 'react';
import Button from 'material-ui/Button';

export default class SudokuButtons extends Component {
	render() {
    	const btnStyle = {marginTop: 25, marginLeft: 18, marginRight: 10};
		return (
			<div className = "SudokuButtons">
			 <Button
		       className = "gameControlBtn"
		       color     = "primary"
		       variant   = "raised"
		       style     = {btnStyle}
		       onClick   = {this.props.onVerifyClick}>
		       Verify
		      </Button>

		      <Button
		       className = "gameControlBtn"
		       color     = "primary"
		       variant   = "raised"
		       style     = {btnStyle}
		       disabled  = {this.props.historyLength < 1}
		       onClick   = {this.props.onUndoClick}>
		       Undo
		       </Button>

		      <Button
		       className = "gameControlBtn"
		       color     = "primary"
		       variant   = "raised"
		       style     = {btnStyle}
		       onClick   = {this.props.onNewGameClick}>
		       New game!
		       </Button>
		    </div>
			);
	}
}
