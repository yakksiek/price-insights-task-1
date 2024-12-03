import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { IVisibilityKey, IVisibilityState } from '../types';

interface IVisibilityAction {
    type: 'TOGGLE_VISIBILITY';
    payload: IVisibilityKey;
}

interface IVisibilityContextType {
    state: IVisibilityState;
    toggleVisibility: (id: IVisibilityKey) => void;
}

interface IProps {
    children: ReactNode;
}

const VisibilityContext = createContext<IVisibilityContextType | undefined>(undefined);

const initialState = {
    campaignCovered: true,
    campaignNotCovered: true,
    monitoringCovered: true,
    monitoringNotCovered: true,
};

const visibilityReducer = (state: IVisibilityState, action: IVisibilityAction) => {
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

export const VisibilityContextProvider: React.FC<IProps> = ({ children }) => {
    const [state, dispatch] = useReducer(visibilityReducer, initialState);

    const toggleVisibility = (id: IVisibilityKey) => {
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
