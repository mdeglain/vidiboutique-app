import React from "react";
import { Checkbox, MenuItem, Select, styled, TextField } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import { Form } from "./form"


const AddressWrapper = styled("div")(({ theme }) => ({
    flex: 2,
    padding: "20px 20px",
    display: "flex",
    flexDirection: "column",
    "& > div": {
        margin: "10px 0"
    }
}))

const SectiontTitle = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.title,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    textDecoration: "underline",
}))

const CheckboxWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    "& > div": {
        marginLeft: "10px"
    }
}))

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.colors.primary,
    padding: "0",
    "&.Mui-checked": {
        color: theme.colors.primary,
    }
}))

const TextareaAutosizeWrapper = styled(TextareaAutosize)(({ theme }) => ({
    width: "100%",
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
}))

export const Address = ({ address, handleChange, handleCheckboxChange, handleComplementaryInformationsChange }) => {
    return (
        <AddressWrapper>
            <Form title={"Adresse de facturation"} address={address} type="facturation" handleChange={handleChange} />
            <CheckboxWrapper>
                <StyledCheckbox checked={address.is_same_address} onChange={handleCheckboxChange} />
                <div onClick={handleCheckboxChange} style={{ cursor: "default" }}>Adresse de livraison est identique à l'adresse de facturation</div>
            </CheckboxWrapper>
            {!address.is_same_address && <Form title={"Adresse de livraison"} address={address} type="delivery" handleChange={handleChange} />}
            <SectiontTitle>Informations complémentaires</SectiontTitle>
            <TextareaAutosizeWrapper value={address.complementary_informations} onChange={handleComplementaryInformationsChange} aria-label="minimum height" minRows={3} placeholder="Commentaires concernant votre commande, ex: consignes des livraisons, ..." />
        </AddressWrapper>
    )
}