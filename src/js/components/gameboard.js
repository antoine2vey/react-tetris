/* eslint-disable react/require-default-props */
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
    containerButtonStyle: PropTypes.object.isRequired,
    buttonText: PropTypes.object
  };

  static defaultProps = {
    buttonText: {}
  }

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

    const { containerButtonStyle, buttonsStyle, buttonText } = this.props

    return (
      <div>
        <table className="game-board">
          <tbody>{rows}</tbody>
        </table>

        <div style={containerButtonStyle}>
          <button style={buttonsStyle} onClick={AppActions.moveLeft}>{buttonText.left || 'Left'}</button>
          <button style={buttonsStyle} onClick={AppActions.moveDown}>{buttonText.down || 'Down'}</button>
          <button style={buttonsStyle} onClick={AppActions.moveRight}>{buttonText.right || 'Right'}</button>
          <button style={buttonsStyle} onClick={AppActions.flipClockwise}>{buttonText.flip || 'Flip'}</button>
          <button style={buttonsStyle} onClick={AppActions.hardDrop}>{buttonText.hardDrop || 'Drop'}</button>
          <button style={buttonsStyle} onClick={AppActions.hold}>{buttonText.hold || 'Hold'}</button>
          <button style={buttonsStyle} onClick={keyboardMap.p}>
            {
              GameStore.getCurrentState() === states.PLAYING
              ? (buttonText.pause || 'Pause')
              : (buttonText.resume || 'Resume')
            }
          </button>
        </div>
      </div>
    );
  }
}
