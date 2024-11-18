import StyledPageWrapper from '../components/PageWrapper';
import PragmaticBlock from '../features/PragmaticBlock/PragmaticBlock';

const blocksData = [
    {
        id: 'blockA',
        name: 'Block A',
        items: [
            { id: '1a', name: '#E7CCCC' },
            { id: '1b', name: '#EDE8DC' },
            { id: '1c', name: '#A5B68D' },
        ],
    },
    {
        id: 'blockB',
        name: 'Block B',
        items: [
            { id: '2a', name: '#E7CCCC' },
            { id: '2b', name: '#EDE8DC' },
            { id: '2c', name: '#A5B68D' },
        ],
    },
    {
        id: 'blockC',
        name: 'Block C',
        items: [
            { id: '3a', name: '#E7CCCC' },
            { id: '3b', name: '#EDE8DC' },
            { id: '3c', name: '#A5B68D' },
        ],
    },
];

function ReportsPage() {
    const renderedBlocks = blocksData.map(block => {
        return <PragmaticBlock blockData={block} key={block.id} />;
    });

    return <StyledPageWrapper>{renderedBlocks}</StyledPageWrapper>;
}

export default ReportsPage;
