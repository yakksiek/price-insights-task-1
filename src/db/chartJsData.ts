import { ChartData } from '../components/ChartJsPieChart';
import { PieChartType } from '../features/Statistics/types/types';
import * as u from '../utils';

// yes, a theme would be a better solution
const primaryBlueColor = u.getCssVariable('--primary-blue') || 'rgb(23, 106, 229)';
const blueGradientStart = u.getCssVariable('--blue-gradient-start') || 'rgba(13, 59, 127, 1)';
const blueShadow = u.getCssVariable('--blue-shadow') || 'rgba(87, 137, 213, 0.787)';
const primaryOrangeColor = u.getCssVariable('--primary-orange') || 'rgb(234, 84, 0)';
const orangeGradientStart = u.getCssVariable('--orange-gradient-start') || 'rgba(229, 23, 147, 1)';

const createChartData = (id: PieChartType): ChartData => ({
    id,
    primaryColor: primaryBlueColor,
    primaryGradientColors: [blueGradientStart, primaryBlueColor],
    primaryColorShadow: blueShadow,
    secondaryColor: primaryOrangeColor,
    secondaryGradientColors: [orangeGradientStart, primaryOrangeColor],
});

export const chartJDataCampaigns = createChartData('campaigns');
export const chartJsDataMonitoring = createChartData('monitoring');
