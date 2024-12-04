import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlobalStyle from "./styles/GlobalStyle.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ChartRendererContextProvider } from "./components/PieChartRenderer/context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <ChartRendererContextProvider>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </ChartRendererContextProvider>
  </StrictMode>,
);
