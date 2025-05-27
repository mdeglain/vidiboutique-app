import styled from 'styled-components';


export const AdornmentWrapper = styled.div`
    position: relative;
    left: -1px;
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 70px;
    height: 48px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 0 ${props => props.theme.radius.round} ${props => props.theme.radius.round} 0;

    &:hover {
        cursor: pointer;
        font-weight: ${props => props.theme.fontWeights.bold};
    }
`;
