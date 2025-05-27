import styled from "styled-components"

export const Label = styled.label`
    color: ${props => props.theme.colors.grey[600]};
    font-size: ${props => props.theme.fontSizes.medium};
    padding-bottom: ${props => props.theme.space.medium};
`