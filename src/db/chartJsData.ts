import { ChartData } from '../components/ChartJsPieChart';
import * as u from '../utils';
import { pricingCampaignsData, pricingMonitoringData } from './pricingMonitoringData';

// yes, a theme would be a better solution
const primaryBlueColor = u.getCssVariable('--primary-blue') || 'rgb(23, 106, 229)';
const blueGradientStart = u.getCssVariable('--blue-gradient-start') || 'rgba(13, 59, 127, 1)';
const blueShadow = u.getCssVariable('--blue-shadow') || 'rgba(87, 137, 213, 0.787)';
const primaryOrangeColor = u.getCssVariable('--primary-orange') || 'rgba(234, 84, 0, 1)';
const orangeGradientStart = u.getCssVariable('--orange-gradient-start') || 'rgba(229, 78, 23, 1)';

export const chartJDataCampaigns: ChartData = {
    primaryData: pricingCampaignsData.data,
    primaryColor: primaryBlueColor,
    primaryGradientColors: [blueGradientStart, primaryBlueColor],
    primaryColorShadow: blueShadow,
    secondaryColor: primaryOrangeColor,
    secondaryGradientColors: [orangeGradientStart, primaryOrangeColor],
};

export const chartJsDataMonitoring: ChartData = {
    primaryData: pricingMonitoringData.data,
    primaryColor: primaryBlueColor,
    primaryGradientColors: [blueGradientStart, primaryBlueColor],
    primaryColorShadow: blueShadow,
    secondaryColor: primaryOrangeColor,
    secondaryGradientColors: [orangeGradientStart, primaryOrangeColor],
};
