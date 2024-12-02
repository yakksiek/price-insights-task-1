import * as t from '../types';

export const pricingCampaignsData: t.ChartMetadata = {
    id: 'campaign',
    header: 'Pricing campaigns',
    subheader: 'Ensure complete allocation of products among pricing campaigns',
    labelPrimary: 'Products in pricing campaign',
    labelSecondary: 'Products without pricing campaign',
};

export const pricingMonitoringData: t.ChartMetadata = {
    id: 'monitoring',
    header: 'Pricing monitoring',
    subheader: 'Ensure maximum coverage of products through monitoring',
    labelPrimary: 'Assortment is covered by monitoring',
    labelSecondary: 'Assortment not covered by monitoring',
};
