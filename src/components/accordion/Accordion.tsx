import React, { MouseEvent } from 'react';
import { Icon } from '@iconify/react';
import arrowDownThick from '@iconify/icons-akar-icons/arrow-down-thick';
import arrowUpThick from '@iconify/icons-akar-icons/arrow-up-thick';
import classes from './Accordion.module.scss';
import { decrementScore, incrementScore } from '../../redux/questions/questionsSlice';
import { useAppDispatch } from '../../hooks/hooks';

interface IAccordionProps {
  questionId: number;
  title: string;
  score: number;
  isAnswered: boolean;
  viewCount: number;
  reputation: number;
  ownerName: string;
  handleDragStart: (event: any, questionId: number) => void;
  handleDragOver: (event: any) => void;
  handleDrop: (event: any, questionId: number) => void;
  open: boolean;
  handleToggleAccordion: (questionId: number) => void;
}

const Accordion: React.FC<IAccordionProps> = props => {
  const {
    questionId,
    title,
    score,
    isAnswered,
    viewCount,
    reputation,
    ownerName,
    handleDragOver,
    handleDragStart,
    handleDrop,
    open,
    handleToggleAccordion,
  } = props;

  const dispatch = useAppDispatch();

  const handleIncrement = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(incrementScore(questionId));
  };

  const handleDecrement = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(decrementScore(questionId));
  };

  return (
    <div
      className={[classes.root, isAnswered ? classes.isAnswered : ''].join(' ')}
      draggable
      onDragStart={e => handleDragStart(e, questionId)}
      onDragOver={handleDragOver}
      onDrop={e => handleDrop(e, questionId)}
    >
      <div className={classes.viewed} onClick={() => handleToggleAccordion(questionId)}>
        <div className={classes.question}>{title}</div>
        <div style={{ flexGrow: 1 }}></div>
        <div className={classes.score}>{score}</div>

        <div className={classes.buttonsGroup}>
          <button onClick={handleIncrement}>
            <Icon icon={arrowUpThick} width={24} height={24} inline />
          </button>
          <button onClick={handleDecrement}>
            <Icon icon={arrowDownThick} width={24} height={24} inline />
          </button>
        </div>
      </div>
      {open && (
        <div className={classes.closed}>
          <div>Имя создателя поста: {ownerName}</div>
          <div>Рейтинг создателя поста: {reputation}</div>
          <div>Количество просмотров: {viewCount}</div>
        </div>
      )}
    </div>
  );
};

export default Accordion;