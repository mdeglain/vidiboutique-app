import React from "react"
import styled from "styled-components"


const Wrapper = styled.div`
    padding: ${props => props.theme.space.large} 0;
    background-color: ${props => props.theme.colors.greyBackground};
`
const Text = styled.div`
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.fontWeights.regular};
    font-size: ${props => props.theme.fontSizes.xl};
    text-align: center;
`


export const FooterTop = () => {
    return (
        <Wrapper>
            <Text>Un produit vous manque dans la boutique ? N'hésitez pas à nous faire part de vos envies !</Text>
        </Wrapper>
    )
}