import styled from 'styled-components'

export const A = styled.a`
    width: 30px;
    height: 30px;
    background-color: rgb(203, 197, 224);
    border-radius: 50%;
    color: rgb(42, 51, 125);
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(:first-child) {

        margin-left: 8px;
    }

    &:hover {
        color: ${props => props.theme.colors.white};
        background-color: ${props => props.bgColor};
    }
`
