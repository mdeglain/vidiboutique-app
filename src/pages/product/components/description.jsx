import React from 'react'

import { styled } from "@mui/material"

const Container = styled("div")({
    flex: 1,
    // height: "150px",
    padding: 20,
    borderTop: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
})

const Title = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.title,
    color: theme.colors.text,
}))

const Content = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
    textAlign: "justify"
}))


export const Description = ({ product }) => {
    return (
        <Container>
            <Title>Description</Title>
            <Content>{product.description || product.short_description}</Content>
        </Container>
    )
}