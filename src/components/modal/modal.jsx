import React, { useContext } from 'react';
import { Modal as MuiModal } from '@mui/material';
import { MdClose } from 'react-icons/md'
import { IconButton } from '@mui/material';

import { Wrapper } from "./wrapper"
import { Box } from "./box"
import { Title } from "./title"
import { ThemeContext } from "../../contexts/theme-context"

export const Modal = ({ open, onClose, title, width, ...props }) => {
    const theme = useContext(ThemeContext);

    const closeButtonStyle = {
        position: "absolute",
        top: 5,
        right: 5,
        color: theme.colors.grey[400]
    }

    const modalStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // margin: "10% 10%"
        // height: "100vh",
    }

    return (
        <MuiModal open={open} onClose={onClose} style={modalStyle}>
            <Wrapper width={width}>
                <Box backgroundColor={props.backgroundColor}>
                    <IconButton style={closeButtonStyle} onClick={onClose}>
                        <MdClose />
                    </IconButton>
                    <Title>{title}</Title>
                    {props.children}
                </Box>
            </Wrapper>
        </MuiModal >
    )
}