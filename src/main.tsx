import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GlobalStyle from './styles/GlobalStyle.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { PieChartContextProvider } from './components/PieChartRenderer/context/PieChartContext.tsx';
import { VisibilityContextProvider } from './components/PieChartRenderer/context/VisibilityContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalStyle />
        <PieChartContextProvider>
            <VisibilityContextProvider>
                <RouterProvider
                    router={router}
                    future={{
                        v7_startTransition: true,
                    }}
                />
            </VisibilityContextProvider>
        </PieChartContextProvider>
    </StrictMode>,
);
