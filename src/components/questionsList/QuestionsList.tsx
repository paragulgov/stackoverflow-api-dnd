import React, { useState, ChangeEvent } from 'react';
import classes from './QuestionsList.module.scss';
import Accordion from '../accordion/Accordion';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  fetchQuestions,
  selectQuestions,
  setCurrentDragQuestion,
  setDate,
  swapQuestions,
} from '../../redux/questions/questionsSlice';

const QuestionsList = () => {
  const [accordionOpen, setAccordionOpen] = useState<number | false>(false);

  const dispatch = useAppDispatch();

  const date = useAppSelector(state => state.questionsSlice.fromDate)
  const oldDate = useAppSelector(state => state.questionsSlice.oldDate)
  const questions = useAppSelector(selectQuestions);
  const copyQuestions = [...questions];

  // Handlers
  const handleDragStart = (event: any, questionId: number) => {
    dispatch(setCurrentDragQuestion(questionId));
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any, questionId: number) => {
    event.preventDefault();
    dispatch(swapQuestions(questionId));
  };

  const handleToggleAccordion = (questionId: number) => {
    setAccordionOpen(prevState => prevState === questionId ? false : questionId);
  };

  const handleChangeDate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const date = new Date(value).getTime();

    dispatch(setDate(date))
  };

  const handleSearchSubmit = () => {
    dispatch(fetchQuestions(date))
  }

  // Renders
  return (
    <div className={classes.root}>
      <div>
        <h1 className={classes.title}>
          5 самых популярных запросов на Stackoverflow, содержащих "react-redux" в наименовании, начиная с
        </h1>
        <input
          className={classes.date}
          type="date"
          onChange={handleChangeDate}
          value={new Date(date).toLocaleDateString('en-CA')}
        />
        {oldDate !== date && <button onClick={handleSearchSubmit}>Поиск</button>}
      </div>
      {copyQuestions.map(q => (
        <Accordion
          key={q.question_id}
          questionId={q.question_id}
          title={q.title}
          score={q.score}
          isAnswered={q.is_answered}
          viewCount={q.view_count}
          reputation={q.owner.reputation}
          ownerName={q.owner.display_name}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          open={accordionOpen === q.question_id}
          handleToggleAccordion={handleToggleAccordion}
        />
      ))}
    </div>
  );
};

export default QuestionsList;