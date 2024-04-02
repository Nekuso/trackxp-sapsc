import { configureStore } from "@reduxjs/toolkit";
import branchesReducer from "./slices/branchesSlice";
import uomsReducer from "./slices/uomsSlice";
import rolesReducer from "./slices/rolesSlice";

export const store = configureStore({
  reducer: {
    branches: branchesReducer,
    uoms: uomsReducer,
    roles: rolesReducer,
  },
});

// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
