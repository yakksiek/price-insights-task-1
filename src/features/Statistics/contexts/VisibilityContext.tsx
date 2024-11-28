import React, { createContext, useContext, useReducer } from 'react';

interface VisibilityState {
    [key: string]: boolean;
}

interface VisibilityAction {
    type: 'TOGGLE_VISIBILITY';
    payload: string;
}

const VisibilityContext = createContext<
    | {
          state: VisibilityState;
          toggleVisibility: (id: string) => void;
      }
    | undefined
>(undefined);

const initialState = {
    ['campaign--covered']: true,
    ['campaign--not-covered']: true,
    ['monitoring--covered']: true,
    ['monitoring--not-covered']: true,
};

const visibilityReducer = (state: VisibilityState, action: VisibilityAction) => {
    switch (action.type) {
        case 'TOGGLE_VISIBILITY':
            return {
                ...state,
                [action.payload]: !state[action.payload],
            };
        default:
            return state;
    }
};

export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(visibilityReducer, initialState);

    const toggleVisibility = (id: string) => {
        dispatch({ type: 'TOGGLE_VISIBILITY', payload: id });
    };

    return <VisibilityContext.Provider value={{ state, toggleVisibility }}>{children}</VisibilityContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useVisibilityContext = () => {
    const context = useContext(VisibilityContext);
    if (!context) {
        throw new Error('useVisibilityContext must be used within a VisibilityProvider');
    }
    return context;
};
