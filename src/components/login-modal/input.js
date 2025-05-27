import styled from "styled-components"

export const Input = styled.input`
    border: solid ${props => props.theme.colors.grey[400]} 1px;
    border-radius: ${props => props.theme.radius.small};
    padding: 8px 12px;
    line-height: 1.5 !important;
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.text};
    
    &:focus {
        outline: none;
    }
`