import React from "react";
import { MenuItem, Select, styled, TextField } from "@mui/material";

import { Label } from "./label"


const SectiontTitle = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.title,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    textDecoration: "underline",
}))

const PersonnalInformations = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    "& > div": {
        width: "48%"
    }
}))

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


export const Form = ({ title, address, type }) => {
    return (
        <React.Fragment>
            <SectiontTitle>{title}</SectiontTitle>
            <PersonnalInformations>
                <InputWrapper>
                    <Label isRequired={true}>Prénom</Label>
                    <TextFieldWrapper disabled={true} name="firstName" size="small" label="" variant="outlined" value={address[type].firstName} />
                </InputWrapper>
                <InputWrapper>
                    <Label isRequired={true}>Nom</Label>
                    <TextFieldWrapper disabled={true} name="lastName" size="small" label="" variant="outlined" value={address[type].lastName} />
                </InputWrapper>
            </PersonnalInformations>
            <InputWrapper>
                <Label isRequired={true}>Entreprise</Label>
                <TextFieldWrapper disabled={true} name="company" size="small" label="" variant="outlined" value={address[type].company} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>SIRET</Label>
                <TextFieldWrapper disabled={true} name="siret" size="small" label="" variant="outlined" value={address[type].siret} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Pays/Région</Label>
                <Select
                    value={"france"}
                    label=""
                    disabled={true}
                    size="small"
                >
                    <MenuItem value={"france"}>France</MenuItem>
                </Select>
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Adresse</Label>
                <TextFieldWrapper disabled={true} name="address" size="small" label="" variant="outlined" value={address[type].address} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Complément d'adresse</Label>
                <TextFieldWrapper disabled={true} name="addressComplement" size="small" label="" variant="outlined" value={address[type].addressComplement} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Code postal</Label>
                <TextFieldWrapper disabled={true} name="zipCode" size="small" label="" variant="outlined" value={address[type].zipCode} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Ville</Label>
                <TextFieldWrapper disabled={true} name="city" size="small" label="" variant="outlined" value={address[type].city} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Numéro de téléphone</Label>
                <TextFieldWrapper disabled={true} name="phone" size="small" label="" variant="outlined" value={address[type].phone} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Adresse mail</Label>
                <TextFieldWrapper disabled={true} name="email" size="small" label="" variant="outlined" value={address[type].email} />
            </InputWrapper>
        </React.Fragment>
    )
}