import React from 'react';
import { styled } from '@mui/system';
import { TextField, CircularProgress } from '@mui/material'; // Added CircularProgress
// import axios from '@/libs/axios'; // Removed axios
import { useDispatch, useSelector } from 'react-redux';
// import { updateUser } from '@/features/auth/user.slice'; // To be removed if relying on getMe refetch
import { 
    useUpdateUserProfileMutation, 
    useChangePasswordMutation 
} from '@/features/user/userApi'; // RTK Query hooks
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
    // const dispatch = useDispatch(); // Keep if other dispatch actions are needed, or remove.
    const user = useSelector((state) => state.user);

    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
    const [changeUserPassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    const [personnalInformations, setPersonnalInformations] = React.useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || ""
    });

    const [passwordInformations, setPasswordInformations] = React.useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    React.useEffect(() => {
        setPersonnalInformations({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || ""
        });
    }, [user.firstName, user.lastName, user.email]);

    const handleChangePersonnalInformations = (event) => {
        setPersonnalInformations({
            ...personnalInformations,
            [event.target.name]: event.target.value
        });
    }

    const handleChangePasswordInformations = (event) => {
        setPasswordInformations({
            ...passwordInformations,
            [event.target.name]: event.target.value
        });
    }

    const onPersonnalInformationsSubmit = () => {
        if (!user.id) {
            toast.error("ID utilisateur manquant.");
            return;
        }
        updateProfile({ 
            id: user.id, 
            first_name: personnalInformations.firstName, 
            last_name: personnalInformations.lastName, 
            email: personnalInformations.email 
        })
        .unwrap()
        .then(() => {
            // dispatch(updateUser(personnalInformations)); // Removed: Rely on getMe refetch via tag invalidation
            toast.success("Informations personnelles mises à jour.");
        })
        .catch((error) => {
            toast.error(error?.data?.message || "Erreur lors de la mise à jour.");
        });
    }

    const onPasswordInformationsSubmit = () => {
        if (!user.id) {
            toast.error("ID utilisateur manquant.");
            return;
        }
        if (passwordInformations.new_password !== passwordInformations.confirm_password) {
            toast.error("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }
        changeUserPassword({ 
            id: user.id, 
            old_password: passwordInformations.old_password, 
            new_password: passwordInformations.new_password,
            confirm_password: passwordInformations.confirm_password // API expects this
        })
        .unwrap()
        .then(() => {
            setPasswordInformations({
                old_password: "",
                new_password: "",
                confirm_password: ""
            });
            toast.success("Mot de passe modifié.");
        })
        .catch((error) => {
            toast.error(error?.data?.message || "Erreur lors de la modification du mot de passe.");
        });
    }

    return (
        <Wrapper>
            <Title>Informations personnelles</Title>
            <InputWrapper>
                <Label isRequired={false}>Prénom</Label>
                <TextFieldWrapper name="firstName" size="small" label="" variant="outlined" value={personnalInformations.firstName} onChange={handleChangePersonnalInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Nom</Label>
                <TextFieldWrapper name="lastName" size="small" label="" variant="outlined" value={personnalInformations.lastName} onChange={handleChangePersonnalInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Email</Label>
                <TextFieldWrapper name="email" size="small" label="" variant="outlined" value={personnalInformations.email} onChange={handleChangePersonnalInformations} />
            </InputWrapper>
            <SubmitButton onClick={onPersonnalInformationsSubmit} disabled={isUpdatingProfile}>
                {isUpdatingProfile ? <CircularProgress size={20} color="inherit"/> : "Enregistrer"}
            </SubmitButton>
            <Title>Modification du mot de passe</Title>
            <InputWrapper>
                <Label isRequired={false}>Ancien mot de passe</Label>
                <TextFieldWrapper type="password" name="old_password" size="small" label="" variant="outlined" value={passwordInformations.old_password} onChange={handleChangePasswordInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Nouveau mot de passe</Label>
                <TextFieldWrapper type="password" name="new_password" size="small" label="" variant="outlined" value={passwordInformations.new_password} onChange={handleChangePasswordInformations} />
            </InputWrapper>
            <InputWrapper>
                <Label isRequired={false}>Confirmez le mot de passe</Label>
                <TextFieldWrapper type="password" name="confirm_password" size="small" label="" variant="outlined" value={passwordInformations.confirm_password} onChange={handleChangePasswordInformations} />
            </InputWrapper>
            <SubmitButton onClick={onPasswordInformationsSubmit} disabled={isChangingPassword}>
                {isChangingPassword ? <CircularProgress size={20} color="inherit"/> : "Enregistrer"}
            </SubmitButton>
        </Wrapper>
    )
}