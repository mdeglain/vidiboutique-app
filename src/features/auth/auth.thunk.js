import toast from "react-hot-toast";
import axios from "../../libs/axios"

import { authSuccess, authError } from "./auth.slice"
import { setUser } from "./user.slice"

export const login = (email, password) => {
    return (dispatch) => {
        const authData = {
            email: email,
            password: password,
        };
        axios
            .post("/auth/login", authData, { credentials: "include" })
            .then((response) => {
                const { user, tokens } = response.data.data
                dispatch(authSuccess(tokens))
                dispatch(setUser(user))
            })
            .catch((error) => {
                dispatch(authError(error?.response?.data?.message))
                toast.error("Erreur lors de la connexion: email ou mot de passe incorrect")
            });
    };
};