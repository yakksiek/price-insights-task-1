import styled from 'styled-components';
import { StyledCardWrapper } from '../../components/Card';
import { DragHandleIcon } from '../../assets/icons';
import { BlockData } from '../Block/block.types';
import PragmaticBlockItem from './PragmaticBlockItem';

const StyledHeader = styled.header`
    display: flex;
    align-items: center;
    padding: 1rem 0;

    svg {
        margin-right: 1rem;
    }
`;

const StyledList = styled.ul``;

interface PragmaticBlockProps {
    blockData: BlockData;
}

function PragmaticBlock({ blockData }: PragmaticBlockProps) {
    const { name, items } = blockData;

    const renderedItems = items.map(item => {
        return <PragmaticBlockItem itemData={item} key={item.id} />;
    });

    return (
        <StyledCardWrapper>
            <StyledHeader>
                <div>
                    <DragHandleIcon />
                </div>
                <h4>{name}</h4>
            </StyledHeader>
            <StyledList>{renderedItems}</StyledList>
        </StyledCardWrapper>
    );
}

export default PragmaticBlock;
