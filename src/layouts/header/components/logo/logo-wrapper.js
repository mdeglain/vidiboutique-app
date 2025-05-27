import styled from 'styled-components';

export const LogoWrapper = styled.a`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    background-color: ${props => props.theme.colors.white};
    padding: 0 ${(props) => props.theme.space.medium};
    flex: 1;
`