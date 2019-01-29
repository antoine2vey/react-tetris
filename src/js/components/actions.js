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

const Actions = ({ containerButtonStyle, buttonStyle, buttons }) => (
  <div style={containerButtonStyle}>
    <button style={buttonStyle} onClick={AppActions.moveLeft}>{buttons.left}</button>
    <button style={buttonStyle} onClick={AppActions.moveDown}>{buttons.down}</button>
    <button style={buttonStyle} onClick={AppActions.moveRight}>{buttons.right}</button>
    <button style={buttonStyle} onClick={AppActions.flipClockwise}>{buttons.flip}</button>
    <button style={buttonStyle} onClick={AppActions.hardDrop}>{buttons.hardDrop}</button>
    <button style={buttonStyle} onClick={AppActions.hold}>{buttons.hold}</button>
    <button style={buttonStyle} onClick={keyboardMap.p}>
      {
        GameStore.getCurrentState() === states.PLAYING
        ? buttons.activity.pause
        : buttons.activity.resume
      }
    </button>
  </div>
)

Actions.propTypes = {
  containerButtonStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  buttons: PropTypes.object
}

Actions.defaultProps = {
  containerButtonStyle: {},
  buttonStyle: {},
  buttons: {}
}

export default Actions