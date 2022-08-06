import React, { useEffect } from 'react';
import classes from './App.module.scss';
import QuestionsList from './components/questionsList/QuestionsList';
import { useAppDispatch } from './hooks/hooks';
import { fetchQuestions } from './redux/questions/questionsSlice';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchQuestions());
  }, []);

  return (
    <div className={classes.app}>
      <QuestionsList />
    </div>
  );
};

export default App;
