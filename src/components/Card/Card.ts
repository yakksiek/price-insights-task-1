import styled from 'styled-components';

const StyledCardWrapper = styled.section`
    /* padding: var(--card-padding); */
    background: var(--background-color-section);
    border-radius: var(--card-radius);
    margin-bottom: 1rem;

    // position relative for pragmatic drag & drop as the indicator uses position absolute
    position: relative;
`;

export default StyledCardWrapper;
