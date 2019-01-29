import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import styled from 'styled-components';
import Tetris from '../src/js/components/tetris';

const Container = styled.div`
  margin: 24px auto 0;
  width: 100%;
  max-width: 376px;
`;

const Score = styled.div`
  position: relative;
  font-family: monospace;
  font-size: 18px;
  color: #888;
`;

const LeftHalf = styled.div`
  display: inline-block;
  width: 50%;
`;

const RightHalf = LeftHalf.extend`
  text-align: right;
`;

const Column = styled.div`
  display: inline-block;
  vertical-align: top;
`;

const LeftColumn = Column.extend`
  width: 88px;
`;

const RightColumn = LeftColumn.extend`
  padding-left: 15px;
`;

const MiddleColumn = Column.extend`
  width: 200px;
`;

const GamePanel = () => (
  <Container>
    <Tetris>
      {({ HeldPiece, Gameboard, PieceQueue, Actions, points, linesCleared, lost, reset }) => (
        <div>
          <Score>
            <LeftHalf>
              <p>
                points - {lost ? 'lost' : 'pending'} - <button onClick={reset}>reset</button><br />
                <Digits>{points}</Digits>
              </p>
            </LeftHalf>
            <RightHalf>
              <p>
                lines<br />
                <Digits>{linesCleared}</Digits>
              </p>
            </RightHalf>
          </Score>

          <LeftColumn>
            <HeldPiece />
          </LeftColumn>

          <MiddleColumn>
            <Gameboard lost={lost} />
          </MiddleColumn>

          <RightColumn>
            <PieceQueue />
          </RightColumn>

          <Actions
            containerButtonStyle={{ display: 'flex' }}
            buttonStyle={{ background: 'transparent', margin: '0 5px' }}
            buttons={{
              left: <div>left</div>,
              down: <div>down</div>,
              right: <div>right</div>,
              flip: <div>flip</div>,
              hardDrop: <div>hard drop</div>,
              hold: <div>hold</div>,
              activity: {
                pause: <div>pause</div>,
                resume: <div>resume</div>
              },
            }}
          />
        </div>
      )}
    </Tetris>
  </Container>
);

const Digit = styled.span`
  font-family: monospace;
  padding: 1px;
  margin: 1px;
  font-size: 24px;
`;

const Digits = ({ children, count = 4 }) => {
  let str = children.toString();

  while (str.length < count) {
    str = `${0}${str}`;
  }

  return str
    .split('')
    .map((digit, index) => <Digit key={index}>{digit}</Digit>);
};

export default GamePanel;
