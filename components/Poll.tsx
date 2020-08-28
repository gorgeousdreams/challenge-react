import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { QandAsDocument, Answer } from '../types';
import QuizChecker from './QuizChecker';

type Props = {
  qandas: QandAsDocument /* q and a's -- questions and answers document */;
};

const PollWrapper = styled.div`
  width: 300px;
  margin: auto;
  border: 1px solid #eeeeee;
  box-shadow: -1px 1px 5px -2px rgba(0,0,0,0.32);
  border-radius: 4px;
  padding: 20px;
`;

const PollHeader = styled.div`
  line-height: 1.2em;
  margin: 0;
`;

const PollBody = styled.div`
  margin: 15px 0;
`;

const PollFooter = styled.div`
  color: #555555;
`;

export default function Poll({ qandas }: Props) {
  const { questions } = qandas; // Destructuring Object

  // Get Random Quiz for every reload
  const [quiz, setQuiz] = useState(questions[Math.floor(Math.random() * questions.length)]);

  const [answered, setAnswered] = useState(0);

  // Method to calculate total votes for this quiz
  const sum = () => quiz.answers.reduce((total, qa) => total + qa.votes, 0);

  // Method to check if QA is the best answer
  const isMax = (qa: Answer) => {
    const max = _.maxBy(quiz.answers, (o) => o.votes); // Get Max Votes using lodash maxBy

    if (max && qa.votes >= max.votes && answered) {
      return true;
    }
    return false;
  };

  // Calculate VoteRate and Store as Quiz
  useEffect(() => {
    if (questions) {
      setQuiz({
        ...quiz,
        answers: quiz.answers.map((answer) => (
          { ...answer, voteRate: sum() !== 0 ? (answer.votes / sum() * 100).toFixed(0) : 0 }
        )),
      });
    }
  }, [questions]);

  const onUpdate = (index: number) => {
    setAnswered(index + 1);
    setQuiz({
      ...quiz,
      answers: quiz.answers.map((answer, i) => i === index ? ({
        ...answer,
        votes: answer.votes + 1,
        voteRate: ((answer.votes + 1) / sum() * 100).toFixed(0),
      }) : answer),
    });
  };

  return (
    <PollWrapper>
      <PollHeader>
        <h3>{quiz.question.text}</h3>
      </PollHeader>
      <PollBody>
        {quiz.answers && quiz.answers.map((qa, index) => (
          <QuizChecker key={`qa-${index}`} index={index} answer={qa} isMax={isMax(qa)} answered={answered} onAnswer={onUpdate} />
        ))}
      </PollBody>
      <PollFooter>
        <span>
          {sum()}
          votes
        </span>
      </PollFooter>
    </PollWrapper>
  );
}
