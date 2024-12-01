import React, { createContext, useContext, useReducer } from 'react';
import { VisibilityKey, VisibilityState } from '../types/types';

interface VisibilityAction {
    type: 'TOGGLE_VISIBILITY';
    payload: VisibilityKey;
}

interface VisibilityContextType {
    state: VisibilityState;
    toggleVisibility: (id: VisibilityKey) => void;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

const initialState = {
    campaignCovered: true,
    campaignNotCovered: true,
    monitoringCovered: true,
    monitoringNotCovered: true,
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

    const toggleVisibility = (id: VisibilityKey) => {
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
