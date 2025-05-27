import React from "react";
import { Checkbox, MenuItem, Select, styled, TextField } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import { Form } from "./form"
import { Label } from "./label";
import { useSelector } from "react-redux";
import { selectAddresses } from "@/features/address/address.slice";


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

const InputWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& > div": {
        width: "100%"
    }
}))

export const Address = ({ addresses, address, setAddress }) => {
    const handleComplementaryInformationsChange = (event) => {
        setAddress({
            ...address,
            address_informations: {
                ...address.address_informations,
                complementary_informations: event.target.value
            }
        });
    }
    return (
        <AddressWrapper>
            <SectiontTitle>Choix de l'adresse</SectiontTitle>
            <InputWrapper>
                <Label>Adresse</Label>
                <Select
                    value={address.public_id}
                    label=""
                    size="small"
                    onChange={(e) => setAddress(addresses.find(addr => addr.public_id === e.target.value))}
                >
                    {addresses.map(addr => <MenuItem value={addr.public_id}>{addr.name}</MenuItem>)}
                </Select>
            </InputWrapper>
            <Form title={"Adresse de facturation"} address={address.address_informations} type="facturation" />
            <CheckboxWrapper>
                <StyledCheckbox disabled={true} checked={address.address_informations.is_same_address} />
                <div style={{ cursor: "default" }}>Adresse de livraison est identique à l'adresse de facturation</div>
            </CheckboxWrapper>
            {!address.address_informations.is_same_address && <Form title={"Adresse de livraison"} address={address.address_informations} type="delivery" />}
            <SectiontTitle>Informations complémentaires</SectiontTitle>
            <TextareaAutosizeWrapper value={address.address_informations.complementary_informations} onChange={handleComplementaryInformationsChange} aria-label="minimum height" minRows={3} placeholder="Commentaires concernant votre commande, ex: consignes des livraisons, ..." />
        </AddressWrapper>
    )
}