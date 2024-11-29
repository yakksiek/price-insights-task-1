import { createContext, useContext, useState } from 'react';

type ChartType = 'campaigns' | 'monitoring';

interface PieChartContextType {
    chartState: Record<ChartType, number>;
    setChartStateHandler: (chartType: ChartType, value: number) => void;
}

const PieChartContext = createContext<PieChartContextType | null>(null);

export const PieChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chartState, setChartState] = useState({ campaigns: 63.5, monitoring: 23.5 });

    const setChartStateHandler = (chartType: ChartType, value: number) => {
        setChartState(prevState => ({ ...prevState, [chartType]: value }));
    };

    return <PieChartContext.Provider value={{ chartState, setChartStateHandler }}>{children}</PieChartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePieChartContext = () => {
    const context = useContext(PieChartContext);
    if (!context) {
        throw new Error('usePieChartContext must be used within a PieChartProvider');
    }

    return context;
};
