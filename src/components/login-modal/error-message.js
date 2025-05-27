import styled from "styled-components"

export const ErrorMessage = styled.div`
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.danger};
`