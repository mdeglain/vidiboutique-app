import React, { useContext, useEffect, useState } from "react";
import { styled, width } from "@mui/system"
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MdVpnKey } from "react-icons/md";
import { VscKey } from "react-icons/vsc";

import axios from "@/libs/axios";
import { TextField } from "@mui/material";
import { ThemeContext } from "@/contexts/theme-context";

const ProfilWrapper = styled('div')(({ theme }) => ({
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
    height: '100%',
    width: '40%',
    margin: "20px auto 0 auto",
    flex: 1,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: theme.radius.medium,
}));

const InputWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0px auto 10px auto",
    "& > div": {
        width: "80%",
        margin: "0px auto 10px auto",
    }
}))

const Label = styled('div')(({ theme }) => ({
    width: "80%",
    margin: "10px auto 0 auto",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
}))

const H2 = styled('h2')(({ theme }) => ({
    color: theme.colors.primary,
}))

const IconWrapper = styled('span')(({ theme }) => ({
    marginTop: "20px",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: theme.colors.secondary,
    position: "relative",
    // margin: "10px auto",
}))

const ConfirmButton = styled('button')(({ theme }) => ({
    width: "80%",
    height: "40px",
    margin: "10px auto",
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    border: "none",
    borderRadius: theme.radius.medium,
    cursor: "pointer",
    "&:hover": {
        backgroundColor: theme.colors.secondary
    }
}))

const ErrorMessage = styled('div')(({ theme }) => ({
    color: theme.colors.danger,
    width: "80%",
    margin: "10px auto",
    textAlign: "left"
}))


export const ResetPassword = () => {
    const [URLSearchParams, _] = useSearchParams()
    const token = URLSearchParams.get("t")
    const navigate = useNavigate();
    const theme = useContext(ThemeContext);

    const [user, setUser] = useState(null)
    const [password, setPassword] = useState({
        new_password: "",
        confirm_password: ""
    })
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        axios.get(`/users/reset-password/${token}`)
            .then(response => setUser(response.data.data))
            .catch(_ => navigate("/"))
    }, [])

    if (!user) return null

    const submitNewPassword = () => {
        if (password.new_password !== password.confirm_password) {
            setErrorMessage("Les mots de passe ne correspondent pas")
            return
        }

        axios.put(`/users/reset-password`, {
            "public_id": user.public_id,
            "new_password": password.new_password,
            "confirm_password": password.confirm_password
        }).then(_ => navigate("/"))
        .catch(_ => setErrorMessage("Une erreur s'est produite"))
    }

    const style = {
        width: "50px",
        height: "50px",
        margin: "auto",
        position: "absolute",
        left: "calc((80px / 2) - (50px / 2))",
        top: "calc((80px / 2) - (50px / 2))",
        color: theme.colors.white
    }

    return (
        <ProfilWrapper>
            <IconWrapper>
                <VscKey style={style} />
            </IconWrapper>
            <H2>Réinitialisez votre mot de passe</H2>
            <InputWrapper>
                <Label>Nouveau mot passe</Label>
                <TextField name="new_password" size="small" label="" variant="outlined" value={password["new_password"]} type="password" onChange={(e) => setPassword({
                    ...password,
                    new_password: e.target.value
                })} />
            </InputWrapper>
            <InputWrapper>
                <Label>Confirmez le mot passe</Label>
                <TextField name="confirm_password" size="small" label="" variant="outlined" value={password["confirm_password"]} type="password" onChange={(e) => setPassword({
                    ...password,
                    confirm_password: e.target.value
                })} />
            </InputWrapper>
            {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
            <ConfirmButton onClick={submitNewPassword}>Valider</ConfirmButton>
        </ProfilWrapper>
    )
}