import React from "react"
import styled from "styled-components"

import { FooterTop, FooterMiddle, FooterBottom } from "./components"

const Wrapper = styled.footer`
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: ${props => props.theme.colors.white};
`

export const Footer = () => {
    return (
        <Wrapper>
            <FooterTop />
            <FooterMiddle />
            <FooterBottom />
        </Wrapper>
    )
}