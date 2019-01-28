/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types'
import key from 'keymaster';
import AppActions from '../actions/app-actions';
import GameStore from '../stores/game-store';
import AppConstants from '../constants/app-constants';
import DetectShift from '../modules/detect-shift';

const { states } = AppConstants;

function gameBoard() {
  return {
    gameBoard: GameStore.getGameBoard()
  };
}

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

function addKeyboardEvents() {
  Object.keys(keyboardMap).forEach(k => {
    if (k === 'shift') {
      DetectShift.bind(keyboardMap[k]);
    } else {
      key(k, keyboardMap[k]);
    }
  });
}
function removeKeyboardEvents() {
  Object.keys(keyboardMap).forEach(k => {
    if (k === 'shift') {
      DetectShift.unbind(keyboardMap[k]);
    } else {
      key.unbind(k);
    }
  });
}

export default class Gameboard extends React.Component {
  static propTypes = {
    lost: PropTypes.bool.isRequired,
    buttonsStyle: PropTypes.object.isRequired,
    containerButtonStyle: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = gameBoard();
  }

  componentWillMount() {
    GameStore.addChangeListener(this._onChange);
    addKeyboardEvents();
    GameStore.start();
  }

  componentDidUpdate() {
    if (this.props.lost) {
      removeKeyboardEvents();
      GameStore.pause();
      GameStore.removeChangeListener(this._onChange);
    }
  }

  componentWillUnmount() {
    removeKeyboardEvents();
    GameStore.pause();
    GameStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(gameBoard());
  };

  render() {
    const rows = this.state.gameBoard.map((row, i) => {
      const blocksInRow = row.map((block, j) => {
        const classString = `game-block ${block || 'block-empty'}`;
        return <td key={j} className={classString} />;
      });

      return <tr key={i}>{blocksInRow}</tr>;
    });
    return (
      <div>
        <table className="game-board">
          <tbody>{rows}</tbody>
        </table>

        <div style={this.props.containerButtonStyle}>
          <button style={this.props.buttonsStyle} onClick={AppActions.moveLeft}>left</button>
          <button style={this.props.buttonsStyle} onClick={AppActions.moveDown}>down</button>
          <button style={this.props.buttonsStyle} onClick={AppActions.moveRight}>right</button>
          <button style={this.props.buttonsStyle} onClick={AppActions.flipCounterclockwise}>rotate</button>
          <button style={this.props.buttonsStyle} onClick={AppActions.hardDrop}>fall</button>
          <button style={this.props.buttonsStyle} onClick={AppActions.hold}>exchange</button>
          <button style={this.props.buttonsStyle} onClick={keyboardMap.p}>pause</button>
        </div>
      </div>
    );
  }
}
