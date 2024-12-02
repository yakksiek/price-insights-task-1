import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GlobalStyle from './styles/GlobalStyle.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { VisibilityProvider } from './features/Statistics/contexts/VisibilityContext.tsx';
import { PieChartProvider } from './features/Statistics/contexts/PieChartContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalStyle />
        <PieChartProvider>
            <VisibilityProvider>
                <RouterProvider
                    router={router}
                    future={{
                        v7_startTransition: true,
                    }}
                />
            </VisibilityProvider>
        </PieChartProvider>
    </StrictMode>,
);
