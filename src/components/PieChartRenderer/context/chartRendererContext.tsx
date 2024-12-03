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

const ChartRendererContext = createContext<IVisibilityContextType | undefined>(undefined);

const initialState = {
    campaignCovered: true,
    campaignNotCovered: true,
    monitoringCovered: true,
    monitoringNotCovered: true,
};

const chartRendererReducer = (state: IVisibilityState, action: IVisibilityAction) => {
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

export const ChartRendererContextProvider: React.FC<IProps> = ({ children }) => {
    const [state, dispatch] = useReducer(chartRendererReducer, initialState);

    const toggleVisibility = (id: IVisibilityKey) => {
        dispatch({ type: 'TOGGLE_VISIBILITY', payload: id });
    };

    return (
        <ChartRendererContext.Provider value={{ state, toggleVisibility }}>{children}</ChartRendererContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChartRendererContext = () => {
    const context = useContext(ChartRendererContext);
    if (!context) {
        throw new Error('useVisibilityContext must be used within a VisibilityProvider');
    }
    return context;
};
