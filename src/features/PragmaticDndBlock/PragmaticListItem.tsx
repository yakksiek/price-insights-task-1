import styled from 'styled-components';
import { ListItem } from '../BeautifulDnbBlock/block.types';
import { DragHandleIcon } from '../../assets/icons';

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

interface PragmaiticBlockItem {
    itemData: ListItem;
}

function PragramaticListItem({ itemData }: PragmaiticBlockItem) {
    const { name } = itemData;

    return (
        <StyledListItem $color={name}>
            <DragHandleIcon />
            <p>{name}</p>
        </StyledListItem>
    );
}

export default PragramaticListItem;
