interface ChartMetadata {
    id: 'campaign' | 'monitoring';
    data: number;
    labelPrimary: string;
    labelSecondary: string;
    header: string;
    subheader: string;
    primaryColor?: 'blue' | 'purple';
}

export default ChartMetadata;
