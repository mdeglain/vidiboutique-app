import React, { createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/system';
import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Paper, IconButton } from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';

// import axios from '@/libs/axios'; // Removed axios
import { 
    useGetAddressesQuery, 
    useCreateAddressMutation, 
    useUpdateAddressMutation, 
    useDeleteAddressMutation 
} from '@/features/address/addressApi'; // RTK Query hooks

import { ThemeContext } from '@/contexts/theme-context';

import { Modal } from '@/components/modal/modal';

import { ModalContent } from './components';
// import { createAddress, removeAddress, selectAddresses, updateAddress } from '@/features/address/address.slice'; // Removed slice imports
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material'; // For loading states


const Container = styled('div')({
    position: "relative",
    paddingTop: "30px",
})

const AddNewAddress = styled('div')(({ theme }) => ({
    position: "absolute",
    top: "10px",
    right: "10px",
    color: theme.colors.white,
    cursor: "pointer",
    textAlign: "center",
    fontSize: theme.fontSizes.m,
    padding: "2px 5px",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.small,
}))

const defaultAdress = {
    name: "",
    address_informations: {
        facturation: {
            firstName: "",
            lastName: "",
            company: "",
            address: "",
            addressComplement: "",
            zipCode: "",
            city: "",
            country: "France",
            phone: "",
            email: "",
        },
        delivery: {
            firstName: "",
            lastName: "",
            company: "",
            address: "",
            addressComplement: "",
            zipCode: "",
            city: "",
            country: "",
            phone: "",
            email: ""
        },
        is_same_address: true,
        complementary_informations: ""
    }
};

export const shouldCheckErrorContext = createContext();

export const AddressesContent = () => {
    const theme = React.useContext(ThemeContext);

    // const dispatch = useDispatch(); // Removed as slice actions are no longer dispatched
    
    const { data: addressesData, isLoading: isLoadingAddresses, isError: isAddressesError, error: addressesApiError } = useGetAddressesQuery();
    const addresses = addressesData?.data || []; // Assuming API returns { data: [...] }
    
    const [createAddressMutation, { isLoading: isCreating }] = useCreateAddressMutation();
    const [updateAddressMutation, { isLoading: isUpdating }] = useUpdateAddressMutation();
    const [deleteAddressMutation, { isLoading: isDeleting }] = useDeleteAddressMutation();

    const [isNew, setIsNew] = React.useState(false);
    const [address, setAddress] = React.useState(null); // Local state for modal form
    const [isModalOpen, setIsModalOpen] = React.useState(null)
    const [shouldCheckError, setShouldCheckError] = React.useState(false)

    const columns = [{ id: 'name', label: 'Nom', align: 'left' }];

    const onCreateClick = () => {
        setIsNew(true)
        setAddress(defaultAdress)
        setIsModalOpen(true)
    }

    const onEditClick = (addressPublicId) => {
        const address = addresses.find(address => address.public_id === addressPublicId)
        setIsNew(false)
        setAddress(address)
        setIsModalOpen(true)
    }

    const handleNameChange = (event) => {
        setAddress({
            ...address,
            name: event.target.value
        });
    }

    const handleChange = (event, type) => {
        setAddress({
            ...address,
            address_informations: {
                ...address.address_informations,

                [type]: {
                    ...address.address_informations[type],
                    [event.target.name]: event.target.value
                }
            }
        });
    }

    const handleCheckboxChange = (_) => {
        setAddress({
            ...address,
            address_informations: {
                ...address.address_informations,
                is_same_address: !address.address_informations.is_same_address
            }
        });
    }

    const handleComplementaryInformationsChange = (event) => {
        setAddress({
            ...address,
            address_informations: {
                ...address.address_informations,
                complementary_informations: event.target.value
            }
        });
    }

    const submit = () => {
        if (hasError()) return;
        
        // Prepare addressData by removing public_id for create, and ensuring it's part of args for update
        const { public_id, ...addressDataForApi } = address;

        if (isNew) {
            createAddressMutation(addressDataForApi) // Send data without public_id
                .unwrap()
                .then(() => {
                    setIsModalOpen(false);
                    toast.success("L'adresse a bien été créée");
                })
                .catch((err) => {
                    toast.error(err?.data?.message || "Une erreur est survenue lors de la création de l'adresse");
                });
        } else {
            updateAddressMutation({ public_id: public_id, ...addressDataForApi })
                .unwrap()
                .then(() => {
                    setIsModalOpen(false);
                    toast.success("L'adresse a bien été modifiée");
                })
                .catch((err) => {
                    toast.error(err?.data?.message || "Une erreur est survenue lors de la modification de l'adresse");
                });
        }
    }

    const remove = (public_id) => {
        deleteAddressMutation(public_id)
            .unwrap()
            .then(() => {
                // No need to close modal here as delete is not from modal in this UI
                toast.success("L'adresse a bien été supprimée");
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Une erreur est survenue lors de la suppression de l'adresse");
            });
    }

    const hasError = () => {
        setShouldCheckError(true)
        if (address.name === "" || address.address_informations.facturation.firstName === "" ||
            address.address_informations.facturation.lastName === "" ||
            address.address_informations.facturation.company === "" ||
            address.address_informations.facturation.address === "" ||
            address.address_informations.facturation.zipCode === "" ||
            address.address_informations.facturation.city === "" ||
            address.address_informations.facturation.phone === "" ||
            address.address_informations.facturation.email === "") {
            toast.error("Veuillez remplir tous les champs obligatoires")
            return true
        }

        if (!address.address_informations.is_same_address) {
            if (address.address_informations.delivery.firstName === "" ||
                address.address_informations.delivery.lastName === "" ||
                address.address_informations.delivery.company === "" ||
                address.address_informations.delivery.address === "" ||
                address.address_informations.delivery.zipCode === "" ||
                address.address_informations.delivery.city === "" ||
                address.address_informations.delivery.phone === "" ||
                address.address_informations.delivery.email === "") {
                toast.error("Veuillez remplir tous les champs obligatoires")
                return true
            }
        }

        return false
    }

    return (
        <Container>
            <AddNewAddress onClick={onCreateClick}>+ Créer une nouvelle adresse</AddNewAddress>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, columnIndex) => (
                                <React.Fragment key={column.id}>
                                    {columnIndex === 0 && <TableCell align={"left"}>N°</TableCell>}
                                    <TableCell
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                    {columnIndex === columns.length - 1 && <TableCell align={"center"}>Actions</TableCell>}
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoadingAddresses && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} align="center">
                                    <CircularProgress size={24} /> Chargement...
                                </TableCell>
                            </TableRow>
                        )}
                        {isAddressesError && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} align="center">
                                    Erreur: {addressesApiError?.data?.message || addressesApiError?.status || 'Impossible de charger les adresses'}
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoadingAddresses && !isAddressesError && addresses.length === 0 && (
                             <TableRow>
                                <TableCell colSpan={columns.length + 2} align="center">Aucune adresse enregistrée.</TableCell>
                            </TableRow>
                        )}
                        {!isLoadingAddresses && !isAddressesError && addresses.map((addressItem, rowIndex) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={addressItem.public_id || addressItem.id}>
                                        <TableCell align={"left"}>{rowIndex + 1}</TableCell>
                                        <TableCell align={"left"}>{addressItem.name}</TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton onClick={() => onEditClick(addressItem.public_id)} disabled={isDeleting}>
                                                <EditIcon style={{ color: theme.colors.primary }} />
                                            </IconButton>
                                            <IconButton onClick={() => remove(addressItem.public_id)} disabled={isDeleting}>
                                                {isDeleting && address?.public_id === addressItem.public_id ? <CircularProgress size={20} /> : <DeleteIcon style={{ color: theme.colors.danger }} />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} width="80%">
                <shouldCheckErrorContext.Provider value={{ shouldCheckError, setShouldCheckError }}>
                    <ModalContent
                        isNew={isNew}
                        name={address?.name}
                        address={address?.address_informations}
                        handleNameChange={handleNameChange}
                        handleChange={handleChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleComplementaryInformationsChange={handleComplementaryInformationsChange}
                        submit={submit}
                        cancel={() => setIsModalOpen(false)}
                        isLoading={isCreating || isUpdating} // Pass loading state to modal content
                    />
                </shouldCheckErrorContext.Provider>
            </Modal>
        </Container>
    )
}