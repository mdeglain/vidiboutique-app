import React from "react"
import styled from "styled-components"


const Wrapper = styled.div`
    background-color: ${props => props.theme.colors.white};
    margin: 0 10%;
    padding: ${props => props.theme.space.medium} 10px;
`

const P = styled.p`
    font-size: ${props => props.theme.fontSizes.m};
    text-align: right;
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.fontWeights.regular};
`


export const FooterBottom = () => {
    const today = new Date()

    return (
        <Wrapper>
            <P>©vidi-{today.getFullYear()}. Tous droits réservés.</P>
        </Wrapper>
    )
}