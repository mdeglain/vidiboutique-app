import React, { useContext } from "react";
import { MenuItem, Select, styled, TextField } from "@mui/material";

import { Label } from "./label"
import { shouldCheckErrorContext } from "../addresses-content";


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


export const Form = ({ title, address, type, handleChange }) => {
    const shouldCheckError = useContext(shouldCheckErrorContext)
    const checkError = (field) => {
        if (shouldCheckError) return false
        return address[type][field] === "" ? true : false
    }

    return (
        <React.Fragment>
            <SectiontTitle>{title}</SectiontTitle>
            <PersonnalInformations>
                <InputWrapper>
                    <Label isRequired={true}>Prénom</Label>
                    <TextFieldWrapper error={checkError("firstName")} name="firstName" size="small" label="" variant="outlined" value={address[type].firstName} onChange={(e) => handleChange(e, type)} />
                </InputWrapper>
                <InputWrapper>
                    <Label isRequired={true}>Nom</Label>
                    <TextFieldWrapper error={checkError("lastName")} name="lastName" size="small" label="" variant="outlined" value={address[type].lastName} onChange={(e) => handleChange(e, type)} />
                </InputWrapper>
            </PersonnalInformations>
            <InputWrapper>
                <Label isRequired={true}>Entreprise</Label>
                <TextFieldWrapper error={checkError("company")} name="company" size="small" label="" variant="outlined" value={address[type].company} onChange={(e) => handleChange(e, type)} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>SIRET</Label>
                <TextFieldWrapper error={checkError("siret")} name="siret" size="small" label="" variant="outlined" value={address[type].siret} onChange={(e) => handleChange(e, type)} />
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
                <TextFieldWrapper error={checkError("address")} name="address" size="small" label="" variant="outlined" value={address[type].address} onChange={(e) => handleChange(e, type)} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Complément d'adresse</Label>
                <TextFieldWrapper name="addressComplement" size="small" label="" variant="outlined" value={address[type].addressComplement} onChange={(e) => handleChange(e, type)} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Code postal</Label>
                <TextFieldWrapper error={checkError("zipCode")} name="zipCode" size="small" label="" variant="outlined" value={address[type].zipCode} onChange={(e) => handleChange(e, type)} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Ville</Label>
                <TextFieldWrapper error={checkError("city")} name="city" size="small" label="" variant="outlined" value={address[type].city} onChange={(e) => handleChange(e, type)} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Numéro de téléphone</Label>
                <TextFieldWrapper error={checkError("phone")} name="phone" size="small" label="" variant="outlined" value={address[type].phone} onChange={(e) => handleChange(e, type)} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={true}>Adresse mail</Label>
                <TextFieldWrapper error={checkError("email")} name="email" size="small" label="" variant="outlined" value={address[type].email} onChange={(e) => handleChange(e, type)} />
            </InputWrapper>
        </React.Fragment>
    )
}