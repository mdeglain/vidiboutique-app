import React, { useContext, useEffect, useState } from "react";
import { styled, width } from "@mui/system"
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MdVpnKey } from "react-icons/md";
import { VscKey } from "react-icons/vsc";
import { TextField, CircularProgress } from "@mui/material"; // Added CircularProgress
import { 
    useLazyVerifyPasswordResetTokenQuery, 
    useConfirmPasswordResetMutation 
} from "@/features/auth/authApi"; // RTK Query hooks
import toast from "react-hot-toast"; // For better user feedback
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
    const [URLSearchParams, _] = useSearchParams();
    const token = URLSearchParams.get("t");
    const navigate = useNavigate();
    const theme = useContext(ThemeContext);

    const [user, setUser] = useState(null); // Stores user data from token verification
    const [password, setPassword] = useState({
        new_password: "",
        confirm_password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const [triggerVerifyToken, { data: verifyData, error: verifyError, isLoading: isVerifying, isFetching: isFetchingVerify }] = useLazyVerifyPasswordResetTokenQuery();
    const [confirmReset, { isLoading: isResetting }] = useConfirmPasswordResetMutation();

    useEffect(() => {
        if (token) {
            triggerVerifyToken(token)
                .unwrap()
                .then((data) => {
                    setUser(data.data); // Assuming user data is in data.data
                })
                .catch((err) => {
                    toast.error(err?.data?.message || "Token invalide ou expiré.");
                    navigate("/");
                });
        } else {
            toast.error("Aucun token de réinitialisation fourni.");
            navigate("/");
        }
    }, [token, triggerVerifyToken, navigate]);
    
    // Effect to handle verifyData if you prefer not to use unwrap in useEffect
    // useEffect(() => {
    //     if (verifyData) {
    //         setUser(verifyData.data);
    //     } else if (verifyError) {
    //         toast.error(verifyError?.data?.message || "Token invalide ou expiré.");
    //         navigate("/");
    //     }
    // }, [verifyData, verifyError, navigate]);


    const submitNewPassword = () => {
        if (password.new_password !== password.confirm_password) {
            setErrorMessage("Les mots de passe ne correspondent pas");
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }
        if (!user || !user.public_id) {
            toast.error("Utilisateur non identifié. Veuillez vérifier le lien.");
            return;
        }

        confirmReset({ 
            public_id: user.public_id, 
            new_password: password.new_password,
            confirm_password: password.confirm_password // Sending confirm_password as per existing logic
        })
        .unwrap()
        .then(() => {
            toast.success("Mot de passe réinitialisé avec succès !");
            navigate("/login"); // Or navigate to login page
        })
        .catch((err) => {
            setErrorMessage(err?.data?.message || "Une erreur s'est produite lors de la réinitialisation.");
            toast.error(err?.data?.message || "Une erreur s'est produite.");
        });
    }

    if (isVerifying || isFetchingVerify || (!user && token)) { // Show loading while verifying or if user not yet set but token exists
        return (
            <ProfilWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                <p>Vérification du token...</p>
            </ProfilWrapper>
        );
    }
    
    if (!user && !token) { // Should have been redirected by useEffect, but as a safeguard
        return null; // Or a message indicating no token
    }
    
    // This check might be redundant if useEffect handles navigation on !user after verification attempt
    if (!user) return <ProfilWrapper><ErrorMessage>Impossible de vérifier l'utilisateur.</ErrorMessage></ProfilWrapper>;


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