import React, { useContext, useState } from 'react'
import React, { useContext, useState } from 'react' // Ensure React is imported if not already
import React, { useContext, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/system'

import { toggleModal, authSuccess, authError } from '../../features/auth/auth.slice'
import { setUser } from '../../features/auth/user.slice'
import { useLoginMutation, useRequestPasswordResetMutation } from '../../features/auth/authApi' // Added useRequestPasswordResetMutation

import { Modal } from "../modal/modal";
import { InputWrapper } from "./input-wrapper"
import { Label } from "./label"
import { Input } from "./input"
import { Button } from "./button"
import { ErrorMessage } from "./error-message"

import LogoVidiBoutique from "@/assets/logo-vidi-boutique-white.png"
import { ThemeContext } from '@/contexts/theme-context'
// import axios from '@/libs/axios' // Removed axios
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
    const [loginMutation, { isLoading: isLoggingIn, isError: isLoginError, error: loginErrorData }] = useLoginMutation();
    const [requestPasswordReset, { isLoading: isResettingPassword, isError: isResetError, error: resetErrorData }] = useRequestPasswordResetMutation();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [resetPassword, setResetPassword] = useState(false)

    const onClose = () => {
        dispatch(toggleModal())
    }

    const onClick = async () => {
        if (resetPassword) {
            requestPasswordReset({ email })
              .unwrap()
              .then(() => {
                toast.success("Un email de réinitialisation de mot de passe vous a été envoyé");
                dispatch(toggleModal());
                setEmail(""); // Clear email field after successful request
              })
              .catch((error) => {
                toast.error(error?.data?.message || "Erreur lors de la demande de réinitialisation.");
              });
        } else {
            try {
                const response = await loginMutation({ email, password }).unwrap();
                // Assuming response.data.data contains user and tokens
                // Adjust based on actual API response structure
                const { user, access_token, refresh_token } = response.data.data; 
                dispatch(authSuccess({ access_token, refresh_token }));
                dispatch(setUser(user));
                toast.success("Connexion réussie !");
                dispatch(toggleModal()); // Close modal on success
            } catch (error) {
                // Error object from unwrap() will contain 'status' and 'data' from the server response
                const message = error?.data?.message || "Email ou mot de passe incorrect";
                dispatch(authError(message)); // Dispatch error to update state.auth.error
                toast.error(`Erreur lors de la connexion: ${message}`);
            }
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
                <ResetLink onClick={() => {
                    setResetPassword(!resetPassword);
                    dispatch(authError(null)); // Clear any previous login errors when switching modes
                }}>{resetPassword ? "Se connecter" : "Réinitialiser le mot de passe"}</ResetLink>

                <ErrorMessage>
                    {resetPassword && isResetError && (resetErrorData?.data?.message || "Erreur de réinitialisation")}
                    {!resetPassword && isLoginError && (loginErrorData?.data?.message || errorMessage)}
                    {!resetPassword && !isLoginError && errorMessage} {/* Show existing errorMessage if not a login error */}
                </ErrorMessage>
                <Button 
                    onClick={onClick} 
                    disabled={isLoggingIn || isResettingPassword}
                >
                    {isLoggingIn ? 'Connexion...' : (isResettingPassword ? 'Réinitialisation...' : (resetPassword ? "Réinitialiser" : "Se connecter"))}
                </Button>
            </Modal>
        )
    return null;
}