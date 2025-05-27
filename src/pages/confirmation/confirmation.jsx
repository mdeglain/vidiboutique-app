import React from "react"
import { styled } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

const Wrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 20px",
}))

const Text = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.primary,
    marginBottom: "20px"
}))

const Button = styled("button")(({ theme }) => ({
    padding: "10px 20px",
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.white,
    backgroundColor: theme.colors.primary,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
        backgroundColor: theme.colors.primary[600]
    }
}))

export const Confirmation = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const status = location.state?.order.data.status
    return (
        <Wrapper>
            {status === "APPROVED" ? 
                (
                    <Text>Votre commande a bien été transmise. Vous recevrez un email de confirmation dans quelques instants.</Text>
                ) : (
                    <Text>Votre commande est en attente de validation par votre administrateur Vidiboutique.</Text>
                )
            }

            <Button onClick={() => navigate("/")}>
                Retourner à la page d'accueil
            </Button>
        </Wrapper>
    )
}