import React from "react"
import { ReactSVG } from "react-svg";

import { A } from "./index"

import styles from "./socialMediaButton.module.css"
// import "./social-media-button.css"

export const SocialMediaButton = ({ link, bgColor, icon, alt, customClassName }) => {
    return (
        <A href={link} bgColor={bgColor} target="_blank">
            <ReactSVG src={icon} alt={alt} className={styles.svg} style={customClassName} />
        </A>
    )
}