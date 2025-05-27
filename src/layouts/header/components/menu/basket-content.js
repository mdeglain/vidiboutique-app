import styled from 'styled-components';

export const BasketIndicator = styled.span`
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 12px;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 50%;
    text-align: center;
    border: 2px solid ${props => props.theme.colors.white};
`;