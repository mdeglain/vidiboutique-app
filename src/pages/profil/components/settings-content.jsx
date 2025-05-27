import React from 'react';
import { styled } from '@mui/system';

import axios from '@/libs/axios';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@/features/auth/user.slice';
import toast from 'react-hot-toast';

const Wrapper = styled('div')(({ theme }) => ({
    // display: 'flex',
    // flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: "10px",
}));

const Title = styled('div')(({ theme }) => ({
    color: theme.colors.primary,
    fontSize: theme.fontSizes.title,
    fontWeight: theme.fontWeights.bold
}));

const InputWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "calc(100% - 20px)",
    "& > div": {
        width: "100%"
    }
}))

const TextFieldWrapper = styled(TextField)(({ theme }) => ({
    width: "100%",

}))

const LabelWrapper = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.primary,
    marginBottom: "3px"
}))

const SubmitButton = styled("button")(({ theme }) => ({
    backgroundColor: theme.colors.primary,
    color: theme.colors.body,
    padding: theme.space.medium,
    borderRadius: theme.radius.medium,
    border: "none",
    cursor: "pointer",
    margin: "20px auto",
    display: "block",
    "&:hover": {
        backgroundColor: theme.colors.secondary
    },
    "&:focus": {
        outline: "none"
    },
}))

const Label = ({ isRequired, children }) => {
    return (
        <LabelWrapper>
            {children}
            {isRequired && <span style={{ color: "red" }}> *</span>}
        </LabelWrapper>
    )
}

export const SettingsContent = () => {
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)

    const [personnalInformations, setPersonnalInformations] = React.useState({
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email
    })

    const [passwordInformations, setPasswordInformations] = React.useState({
        "old_password": "",
        "new_password": "",
        "confirm_password": ""
    })

    const handleChangePersonnalInformations = (event) => {
        setPersonnalInformations({
            ...personnalInformations,
            [event.target.name]: event.target.value
        })
    }

    const handleChangePasswordInformations = (event) => {
        setPasswordInformations({
            ...passwordInformations,
            [event.target.name]: event.target.value
        })
    }

    const onPersonnalInformationsSubmit = () => {
        axios.put(`/users/${user.id}`, {
            "first_name": personnalInformations.firstName,
            "last_name": personnalInformations.lastName,
            "email": personnalInformations.email
        }).then((_) => {
            dispatch(updateUser(personnalInformations))
        })
    }

    const onPasswordInformationsSubmit = () => {
        axios.put(`/users/${user.id}/password`, {
            "old_password": passwordInformations.old_password,
            "new_password": passwordInformations.new_password,
            "confirm_password": passwordInformations.confirm_password
        }).then((_) => {
            setPasswordInformations({
                "old_password": "",
                "new_password": "",
                "confirm_password": ""
            })
            toast.success("Mot de passe modifié")
        }).catch((error) => {
            toast.error("Une erreur est survenue lors de la modification du mot de passe")
        })
    }



    return (
        <Wrapper>
            <Title>Informations personnelles</Title>
            <InputWrapper>
                <Label isRequired={false}>Prénom</Label>
                <TextFieldWrapper name="firstName" size="small" label="" variant="outlined" value={personnalInformations?.firstName} onChange={handleChangePersonnalInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Nom</Label>
                <TextFieldWrapper name="lastName" size="small" label="" variant="outlined" value={personnalInformations?.lastName} onChange={handleChangePersonnalInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Email</Label>
                <TextFieldWrapper name="email" size="small" label="" variant="outlined" value={personnalInformations?.email} onChange={handleChangePersonnalInformations} />
            </InputWrapper>
            <SubmitButton onClick={onPersonnalInformationsSubmit}>Enregistrer</SubmitButton>
            <Title>Modification du mot de passe</Title>
            <InputWrapper>
                <Label isRequired={false}>Ancien mot de passe</Label>
                <TextFieldWrapper type="password" name="old_password" size="small" label="" variant="outlined" value={passwordInformations?.old_password} onChange={handleChangePasswordInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Nouveau mot de passe</Label>
                <TextFieldWrapper type="password" name="new_password" size="small" label="" variant="outlined" value={passwordInformations?.new_password} onChange={handleChangePasswordInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Confirmez le mot de passe</Label>
                <TextFieldWrapper type="password" name="confirm_password" size="small" label="" variant="outlined" value={passwordInformations?.confirm_password} onChange={handleChangePasswordInformations} />
            </InputWrapper>
            <SubmitButton onClick={onPasswordInformationsSubmit}>Enregistrer</SubmitButton>
        </Wrapper>
    )
}