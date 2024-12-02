interface ChartMetadata {
    id: 'campaign' | 'monitoring';
    labelPrimary: string;
    labelSecondary: string;
    header: string;
    subheader: string;
    primaryColor?: 'blue' | 'purple';
}

export default ChartMetadata;
