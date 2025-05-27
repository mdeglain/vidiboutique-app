import React, { useContext } from "react";

import { styled } from "@mui/system";

import { Address } from "./address";
import { Label } from "./label";
import { TextField } from "@mui/material";
import { shouldCheckErrorContext } from "../addresses-content";

const Title = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.title,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    textDecoration: "underline",
}));

const Cancel = styled("div")(({ theme }) => ({
    cursor: "pointer",
    color: theme.colors.primary,
    textAlign: "center",
    fontSize: theme.fontSizes.m,
    padding: "2px 5px",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.small,
    marginTop: "10px",
    border: `1px solid ${theme.colors.primary}`,
}));

const Submit = styled("div")(({ theme }) => ({
    cursor: "pointer",
    color: theme.colors.white,
    textAlign: "center",
    fontSize: theme.fontSizes.m,
    padding: "2px 5px",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.small,
    marginTop: "10px",
}));

const InputWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& > div": {
        width: "100%"
    }
}))

const TextFieldWrapper = styled(TextField)(({ theme }) => ({
    width: "100%",

}))

export const DefaultOrderModalContent = ({ isNew, name, handleNameChange, submit, cancel }) => {
    return (
        <React.Fragment>
            <Title>{isNew ? "Nouvelle commande par défaut" : "Modification de la commande par défaut"}</Title>
            <InputWrapper>
                <Label isRequired={true}>Intitulé</Label>
                <TextFieldWrapper name="name" size="small" label="" variant="outlined" value={name} onChange={(e) => handleNameChange(e.target.value)} />
            </InputWrapper>
            <Cancel onClick={cancel}>Annuler</Cancel>
            <Submit onClick={submit}>Enregistrer</Submit>
        </React.Fragment>
    );
};