import React from 'react';
import PropTypes from 'prop-types';
// import PauseMenu from './pause-menu';
import Gameboard from './gameboard';
import ScoreStore from '../stores/score-store';
import HeldPiece from './held-piece';
import PieceQueue from './piece-queue';
import PieceStore from '../stores/piece-store';
import appConstants from '../constants/app-constants';

function getScore() {
  return {
    points: ScoreStore.getPoints(),
    linesCleared: ScoreStore.getLinesCleared(),
    lost: ScoreStore.lost()
  };
}

export default class Tetris extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = getScore();
  }

  componentWillMount() {
    ScoreStore.addChangeListener(this._onChange);

    PieceStore.on(appConstants.events.PLAYER_LOST, () => {
      // Make tick a no-op
      PieceStore.tick = () => {}
      ScoreStore.removeAllListeners()

      this.setState(state => ({
        lost: !state.lost
      }))
    })
  }

  componentWillUnmount() {
    ScoreStore.removeChangeListener(this._onChange);
    PieceStore.removeAllListeners();
  }

  _onChange = () => {
    this.setState(getScore());
  };

  render() {
    const { points, linesCleared, lost } = this.state;

    return this.props.children({
      HeldPiece,
      Gameboard,
      PieceQueue,
      points,
      linesCleared,
      lost
    });
  }
}
