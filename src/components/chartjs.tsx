import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { useEffect, useRef } from 'react';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController); // Register DoughnutController

function MyPieChart() {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null); // Track the chart instance

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        // Create gradient for the blue slice
        const gradientBlue = ctx.createRadialGradient(100, 100, 50, 100, 100, 100);
        gradientBlue.addColorStop(0, '#0D3B7F');
        gradientBlue.addColorStop(1, '#176AE5');

        // Initialize Chart.js with the doughnut chart
        chartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Products in pricing campaign', 'Other'],
                datasets: [
                    {
                        data: [62.5, 37.5],
                        backgroundColor: [gradientBlue, '#e94723'], // Gradient for the blue slice, solid color for the orange slice
                        hoverOffset: 4,
                        borderWidth: 2,
                        borderColor: 'white',
                    },
                ],
            },
            options: {
                cutout: '75%', // Hole size
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
            },
        });

        // Cleanup function to destroy the chart instance when the component unmounts
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, []);

    return <canvas ref={chartRef} width='200' height='200'></canvas>;
}

export default MyPieChart;
