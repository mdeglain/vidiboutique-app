import { styled } from "@mui/material"
import React from "react"


export const Wrapper = styled('a')(({ theme }) => {
    return ({
        height: '100%',
        backgroundColor: theme.colors.white,
        padding: `0 ${theme.space.medium}`,
        flex: '1',
    })
})

export const ClickableImage = ({ href, img, alt, customClassName }) => {
    return (
        <Wrapper href={href} target="_blank">
            <img src={img} alt={alt} style={customClassName} />
        </Wrapper>
    )
}