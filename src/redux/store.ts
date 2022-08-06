import { configureStore } from '@reduxjs/toolkit';
import { questionsReducer } from './questions/questionsSlice';

export const store = configureStore({
  reducer: {
    questionsSlice: questionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch