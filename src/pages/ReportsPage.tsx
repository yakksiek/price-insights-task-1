import styled from 'styled-components';
import { DragHandleIcon } from '../assets/icons';
import { StyledCardWrapper } from '../components/Card';
import StyledPageWrapper from '../components/PageWrapper';

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

const StyledHeader = styled.header`
    display: flex;
    align-items: center;
    padding: 1rem 0;

    svg {
        margin-right: 1rem;
    }
`;

const StyledList = styled.ul``;

interface StyledListItemProps {
    $color: string;
}

const StyledListItem = styled.li<StyledListItemProps>`
    background-color: ${props => props.$color};
    padding: 1rem;
    margin-bottom: 1rem;

    display: flex;
    align-items: center;

    svg {
        margin-right: 1rem;
    }
`;

function ReportsPage() {
    const renderedBlocks = blocksData.map(block => {
        const renderedItems = block.items.map(item => {
            return (
                <StyledListItem $color={item.name} key={item.id}>
                    <DragHandleIcon />
                    <p>{item.name}</p>
                </StyledListItem>
            );
        });

        return (
            <StyledCardWrapper key={block.id}>
                <StyledHeader>
                    <DragHandleIcon />
                    <h4>{block.name}</h4>
                </StyledHeader>
                <StyledList>{renderedItems}</StyledList>
            </StyledCardWrapper>
        );
    });

    return <StyledPageWrapper>{renderedBlocks}</StyledPageWrapper>;
}

export default ReportsPage;
