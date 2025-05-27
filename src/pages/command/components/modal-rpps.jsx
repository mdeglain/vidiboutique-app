import React, { useContext } from "react"
import { Box, Modal, Typography, styled } from "@mui/material"

import { ThemeContext } from "@/contexts/theme-context"

const StyledBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    // height: "200px",
    // border: "2px solid #000",
    boxShadow: 24,
    padding: "20px",
    backgroundColor: theme.colors.white,
}));

const Input = styled("input")(({ theme }) => ({
    width: "100%",
    height: "30px",
    border: "1px solid #000",
    // padding: "5px",
    // margin: "5px 0",
}));

const Button = styled("button")(({ theme }) => ({
    width: "100%",
    height: "30px",
    border: "1px solid #000",
    padding: "5px",
    margin: "5px 0",
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
}));

export const ModalRPPS = ({ RPPS, setRPPS, isOpen, handleClose, submit }) => {
    const theme = useContext(ThemeContext);
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <StyledBox>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Confirmation de l'identité
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Votre commande comporte des éléments protégés.
                    <br/>Veuillez renseigner un numéro RPPS pour confirmer votre identité.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Input type="text" value={RPPS} onChange={(e) => setRPPS(e)} />
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Button onClick={submit}>Valider</Button>
                </Typography>
            </StyledBox>
            </Modal>
    )
}