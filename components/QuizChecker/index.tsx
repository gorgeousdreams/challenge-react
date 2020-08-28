import * as React from 'react';
import styled from 'styled-components';
import { Quiz } from '../../types';

type Props = {
  answer: Quiz, /* Answer's -- Answer, Votes, VoteRate Document */
  isMax: boolean,
  index: number,
  onAnswer: Function,
  answered: number,
}

interface QuizWrapperProps {
  rate?: number,
  isMax?: boolean,
  answered?: number,
}

interface RateElementProps {
  isAnswered?: number,
  isMax?: boolean,
}

// If clicked, show background and don't show Hover
const QuizWrapper = styled.div<QuizWrapperProps>`
  margin: 10px 0;
  padding: 3px 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  position: relative;
  box-shadow: -1px 1px 5px -2px rgba(0,0,0,0.32);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  ${({ answered }) => !answered
  && `&:hover {
    background: #eeeeee;
  }`}
  & > div.foreground {
    ${({ isMax }) => `background: ${isMax ? '#a2fff4' : '#e8e8e8'};
    `}
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    ${({ answered, rate }) => `width: ${answered ? rate : '0'}%;
    `}
    transition: width 0.5s ease-in;
  }
`;

const RateElement = styled.span<RateElementProps>`
  font-weight: ${({ isMax }) => isMax ? 900 : 500};
  display: flex;
  align-items: center;
  z-index: 1;
`;

const CheckIcon = styled.img`
  width: 23px;
  height: 23px;
  padding-left: 10px;
`;

export default function QuizChecker({
  answer, index, isMax, answered, onAnswer,
}: Props) {
  return (
    <QuizWrapper
      rate={answer.voteRate}
      answered={answered}
      isMax={isMax}
      onClick={() => onAnswer(index)}
    >
      <div className="foreground" />
      <RateElement isMax={isMax}>
        {answer.text}
        { answered === index + 1
          && <CheckIcon src="static/check-circle.svg" alt="check icon" /> }
      </RateElement>
      { !!answered
        && (
        <RateElement isMax={isMax}>
          {answer.voteRate}
          %
        </RateElement>
        )}
    </QuizWrapper>
  );
}
