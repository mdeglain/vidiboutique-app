import styled from "styled-components"

export const Button = styled.button`
    width: 40%;
    margin: 30px auto 0 auto;
    text-align: center;
    color: ${props => props.theme.colors.button.secondary};
    background-color: ${props => props.theme.colors.secondary};
    border-radius: ${props => props.theme.radius.small};
    display: block;
    font-size: ${props => props.theme.fontSizes.large};
    padding: ${props => props.theme.space.medium};
    border: none;

    &:hover {
        background-color: ${props => props.theme.colors.button.hover};
        outline: none;
    }
`