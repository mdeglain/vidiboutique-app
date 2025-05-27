import styled from 'styled-components'

export const Title = styled.div`
    font-size: ${props => props.theme.fontSizes.title};
    font-weight: ${props => props.theme.fontWeights.bold};
    padding-bottom: ${props => props.theme.space.mediumx};
`