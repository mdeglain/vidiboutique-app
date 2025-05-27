import React, { useContext, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/system'

import { toggleModal } from '../../features/auth/auth.slice'
import { login } from '../../features/auth/auth.thunk'

import { Modal } from "../modal/modal";
import { InputWrapper } from "./input-wrapper"
import { Label } from "./label"
import { Input } from "./input"
import { Button } from "./button"
import { ErrorMessage } from "./error-message"

import LogoVidiBoutique from "@/assets/logo-vidi-boutique-white.png"
import { ThemeContext } from '@/contexts/theme-context'
import axios from '@/libs/axios'
import toast from 'react-hot-toast'

const LogoWrapper = styled('div')({
    width: "100%",
    textAlign: "center",

    "& img": {
        width: "50%",
        marginBottom: "1rem"
    }
})

const Title = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.title,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.colors.secondary,
    marginBottom: theme.space.medium
}));

const Description = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.l,
    textAlign: "center",
    color: theme.colors.white,
    marginBottom: theme.space.medium
}));

const ResetLink = styled('div')(({ theme }) => ({
    fontSize: theme.fontSizes.l,
    textAlign: "left",
    color: theme.colors.secondary,
    cursor: "pointer",
    marginBottom: theme.space.medium,
    paddingLeft: "26px"
}));
    


export const LoginModal = () => {
    const isLoginModalOpen = useSelector((state) => state.auth.isModalOpen)
    const errorMessage = useSelector((state) => state.auth.error)
    const theme = useContext(ThemeContext);

    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [resetPassword, setResetPassword] = useState(false)

    const onClose = () => {
        dispatch(toggleModal())
    }

    const onClick = () => {
        if (resetPassword) {
            axios.post("/users/reset-password", { email }).then(_ => {
                toast.success("Un email de réinitialisation de mot de passe vous a été envoyé")
                dispatch(toggleModal())
            })
        } else {
            dispatch(login(email, password))
        }
    }

    if (isLoginModalOpen)
        return (
            <Modal
                open={isLoginModalOpen}
                onClose={onClose}
                width="30%"
                title=""
                backgroundColor={theme.colors.primary}
            >
                <LogoWrapper>
                    <img src={LogoVidiBoutique} alt="Vidiboutique" />
                </LogoWrapper>
                <Title>Bienvenue sur la boutique Vidi</Title>
                {resetPassword ? <Description>Entrez votre email pour réinitialiser votre mot de passe :</Description> :
                    <Description>Entrez votre email et votre mot de passe :</Description>
                }
                <InputWrapper>
                    {/* <Label>Email</Label> */}
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                </InputWrapper>
                {!resetPassword &&
                    <InputWrapper>
                        {/* <Label>Mot de passe</Label> */}
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe"/>
                    </InputWrapper>
                }
                <ResetLink onClick={() => setResetPassword(!resetPassword)}>{resetPassword ? "Se connecter" : "Réinitialiser le mot de passe"}</ResetLink>

                <ErrorMessage>{errorMessage}</ErrorMessage>
                <Button onClick={onClick}>{resetPassword ? "Réinitialiser" : "Se connecter"}</Button>
            </Modal>
        )
    return null;
}