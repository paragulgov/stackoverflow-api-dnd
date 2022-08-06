import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IQuestion {
  question_id: number;
  is_answered: boolean;
  title: string;
  score: number;
  order: number;
  view_count: number;
  owner: {
    display_name: string;
    reputation: number;
  };
}

export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async (date?: number) => {

    const url = `https://api.stackexchange.com/2.3/search?pagesize=5&fromdate=${date ? (date / 1000) : 1514764800}&order=desc&sort=votes&intitle=react-redux&site=stackoverflow`;
    const response = await fetch(url);
    const json = await response.json();

    return {
      response: json,
      date: date,
    };
  },
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    questionsList: [] as IQuestion[],
    currentDragQuestion: null as null | IQuestion,
    fromDate: 1514764800000,
  },
  reducers: {
    setCurrentDragQuestion: (state, action: PayloadAction<number>) => {
      const newQuestion = state.questionsList.find(q => q.question_id === action.payload);
      if (newQuestion) {
        state.currentDragQuestion = newQuestion;
      }
    },
    swapQuestions: (state, action: PayloadAction<number>) => {
      const currentDroppedQuestion = state.questionsList.find(el => el.question_id === action.payload);

      state.questionsList = state.questionsList.map(q => {
        if (q.question_id === action.payload) {
          if (state.currentDragQuestion) {
            return { ...q, order: state.currentDragQuestion?.order };
          }
        }
        if (q.question_id === state.currentDragQuestion?.question_id) {
          if (currentDroppedQuestion) {
            return { ...q, order: currentDroppedQuestion?.order };
          }
        }
        return q;
      });
    },
    incrementScore: (state, action: PayloadAction<number>) => {
      state.questionsList = state.questionsList.map(q => (
        q.question_id === action.payload ? ({ ...q, score: q.score + 1 }) : q
      ));
    },
    decrementScore: (state, action: PayloadAction<number>) => {
      state.questionsList = state.questionsList.map(q => (
        q.question_id === action.payload ? ({ ...q, score: q.score - 1 }) : q
      ));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestions.fulfilled, (state, { payload }) => {
      state.questionsList = payload.response?.items?.map((item: any, index: number) => ({ ...item, order: index }));
      if (payload.date) {
        state.fromDate = payload.date;
      }
    });
  },
});

export const {
  swapQuestions,
  setCurrentDragQuestion,
  incrementScore,
  decrementScore,
} = questionsSlice.actions;

export const selectQuestions = (state: RootState) => {
  const copy = [...state.questionsSlice.questionsList];
  return copy.sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const questionsReducer = questionsSlice.reducer;