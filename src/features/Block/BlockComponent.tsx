import styled from 'styled-components';
import { arrowDownIcon, arrowUpIcon, dragHandleIcon } from '../../assets/icons';
import { StyledCardWrapper } from '../../components/Card';

const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--header-margin-bottom);
`;

const StyledTitleWrapper = styled.div`
    display: flex;
    align-items: center;

    img {
        margin-right: 1rem;
        cursor: pointer;
    }
`;

const StyledActionButtonsWrapper = styled.div`
    display: flex;
    gap: 1rem;

    button {
        cursor: pointer;
        border: 1px solid black;
        padding: 1rem;
        border-radius: var(--card-radius);

        &:disabled {
            pointer-events: none;
            border: 1px solid lightgrey;
        }
    }
`;

const StyledList = styled.ul`
    .item {
        display: flex;
        align-items: center;
        border: 1px solid black;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: var(--card-radius);

        img {
            margin-right: 1rem;
            cursor: pointer;
        }
    }
`;

interface ListItem {
    id: string;
    name: string;
}

interface BlockData {
    items: ListItem[];
    name: string;
    id: string;
}

interface BlockComponentProps {
    blockData: BlockData;
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

function BlockComponent({ blockData, isFirst, isLast, onMoveUp, onMoveDown }: BlockComponentProps) {
    const renderedListItems = blockData.items.map(item => {
        const { id, name } = item;
        return (
            <li key={id} className='item' style={{ backgroundColor: name }}>
                <img src={dragHandleIcon} alt='drag handle icon' />
                <p>{name}</p>
            </li>
        );
    });

    return (
        <StyledCardWrapper>
            <StyledHeader>
                <StyledTitleWrapper>
                    <img src={dragHandleIcon} alt='drag handle icon' />
                    <h4>{blockData.name}</h4>
                </StyledTitleWrapper>
                <StyledActionButtonsWrapper>
                    <button disabled={isLast} aria-disabled={isLast} onClick={onMoveDown}>
                        <img src={arrowDownIcon} alt='arrow down icon' className='arrow-up' />
                    </button>
                    <button disabled={isFirst} aria-disabled={isFirst} onClick={onMoveUp}>
                        <img src={arrowUpIcon} alt='arrow up icon' className='arrow-down' />
                    </button>
                </StyledActionButtonsWrapper>
            </StyledHeader>
            <StyledList>{renderedListItems}</StyledList>
        </StyledCardWrapper>
    );
}

export default BlockComponent;
