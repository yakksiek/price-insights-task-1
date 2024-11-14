import styled from 'styled-components';
import { arrowDownIcon, arrowUpIcon, dragHandleIcon } from '../../assets/icons';
import { StyledCardWrapper } from '../../components/Card';

// prettier-ignore
const colors = [
  'crimson', 
  'lightyellow', 
  'lightgreen'
];

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

    img {
        cursor: pointer;
        border: 1px solid black;
        padding: 1rem;
        border-radius: var(--card-radius);
    }
`;

const StyledContentContainer = styled.div`
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

interface BlockComponentProps {
    name: string;
}

function BlockComponent({ name }: BlockComponentProps) {
    const renderedItems = colors.map(item => {
        return (
            <div key={item} className='item' style={{ backgroundColor: item }}>
                <img src={dragHandleIcon} alt='drag handle icon' />
                <p>{item}</p>
            </div>
        );
    });

    return (
        <StyledCardWrapper>
            <StyledHeader>
                <StyledTitleWrapper>
                    <img src={dragHandleIcon} alt='drag handle icon' />
                    <h4>Block {name}</h4>
                </StyledTitleWrapper>
                <StyledActionButtonsWrapper>
                    <img src={arrowDownIcon} alt='arrow down icon' />
                    <img src={arrowUpIcon} alt='arrow up icon' />
                </StyledActionButtonsWrapper>
            </StyledHeader>
            <StyledContentContainer>{renderedItems}</StyledContentContainer>
        </StyledCardWrapper>
    );
}

export default BlockComponent;
