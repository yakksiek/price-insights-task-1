import { getCssVariable } from '../utils';
import { pricingCampaignsData, pricingMonitoringData } from './pricingMonitoringData';
import * as t from '../types';

const primaryBlue = getCssVariable('--primary-blue') || 'rgb(23, 106, 229)';
const primaryPurple = getCssVariable('--primary-purple') || 'rgb(113, 7, 226)';

export const plotlyChartConfigPricingCampaigns: t.PlotlyChartConfig = {
    configPrimaryData: pricingCampaignsData.data,
    colorPrimary: primaryBlue,
    colorScheme: 'blue',
};

export const plotlyChartConfigMonitoringData: t.PlotlyChartConfig = {
    configPrimaryData: pricingMonitoringData.data,
    colorPrimary: primaryPurple,
    colorScheme: 'purple',
};
