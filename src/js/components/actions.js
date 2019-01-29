/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import AppActions from '../actions/app-actions';
import GameStore from '../stores/game-store';
import AppConstants from '../constants/app-constants';

const { states } = AppConstants;

const keyboardMap = {
  down: AppActions.moveDown,
  left: AppActions.moveLeft,
  right: AppActions.moveRight,
  space: AppActions.hardDrop,
  z: AppActions.flipCounterclockwise,
  x: AppActions.flipClockwise,
  up: AppActions.flipClockwise,
  p: () => {
    if (GameStore.getCurrentState() === states.PLAYING) {
      AppActions.pause();
    } else {
      AppActions.resume();
    }
  },
  c: AppActions.hold,
  shift: AppActions.hold
};

const Actions = ({ containerButtonStyle, buttonStyle, buttonText }) => (
  <div style={containerButtonStyle}>
    <button style={buttonStyle} onClick={AppActions.moveLeft}>{buttonText.left || 'Left'}</button>
    <button style={buttonStyle} onClick={AppActions.moveDown}>{buttonText.down || 'Down'}</button>
    <button style={buttonStyle} onClick={AppActions.moveRight}>{buttonText.right || 'Right'}</button>
    <button style={buttonStyle} onClick={AppActions.flipClockwise}>{buttonText.flip || 'Flip'}</button>
    <button style={buttonStyle} onClick={AppActions.hardDrop}>{buttonText.hardDrop || 'Drop'}</button>
    <button style={buttonStyle} onClick={AppActions.hold}>{buttonText.hold || 'Hold'}</button>
    <button style={buttonStyle} onClick={keyboardMap.p}>
      {
        GameStore.getCurrentState() === states.PLAYING
        ? (buttonText.pause || 'Pause')
        : (buttonText.resume || 'Resume')
      }
    </button>
  </div>
)

Actions.propTypes = {
  containerButtonStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  buttonText: PropTypes.object
}

Actions.defaultProps = {
  containerButtonStyle: {},
  buttonStyle: {},
  buttonText: {}
}

export default Actions