import React, { useState } from "react"

import { styled } from "@mui/material"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import defaultImage from "../../../assets/logo-vidi-boutique.png"

import styles from "./pictures.module.css"
import "./pictures.css"


const ArrowContainerLeft = styled("div")({
    position: "absolute",
    top: "calc(50% - 12.5px)",
    left: "5px",
    color: "black",
    opacity: 0,
    transition: "opacity 100ms",
    border: "2px solid black",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    zIndex: 99,
    cursor: "pointer",

    "&:hover": {
        color: "grey",
        borderColor: "grey",
    }
})
const ArrowContainerRight = styled("div")({
    position: "absolute",
    top: "calc(50% - 12.5px)",
    right: "5px",
    color: "black",
    opacity: 0,
    transition: "opacity 100ms",
    border: "2px solid black",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    zIndex: 99,
    cursor: "pointer",

    "&:hover": {
        color: "grey",
        borderColor: "grey",
    }
})

const Container = styled("div")({
    width: "calc(50% - 40px)",
    // aspectRatio: "1 / 1",
    margin: "20px",
})

const ImgContainer = styled("div")({
    "& img": {
        width: "100%",
        height: "auto",
        objectFit: "contain",
        aspectRatio: "1 / 1",
    }
})

export const Pictures = ({ product }) => {
    const items = [
        <ImgContainer><img src={product.image_link} /></ImgContainer>,
    ]
    if (product.second_image_link) {
        items.push(<ImgContainer><img src={product.second_image_link} /></ImgContainer>)
    }
    if (product.third_image_link) {
        items.push(<ImgContainer><img src={product.third_image_link} /></ImgContainer>)
    }
    return (
        <Container>
            <Carousel
                renderArrowPrev={(clickHandler, hasNext, labelNext) => (<ArrowContainerLeft><IoIosArrowBack onClick={clickHandler} className={styles.ArrowLeft} /></ArrowContainerLeft>)}
                renderArrowNext={(clickHandler, hasNext, labelNext) => (<ArrowContainerRight><IoIosArrowForward onClick={clickHandler} className={styles.ArrowRight} /></ArrowContainerRight>)}
                showStatus={false}
                showIndicators={false}
                infiniteLoop
            >
                {items}
            </Carousel>
        </Container>
    )
}