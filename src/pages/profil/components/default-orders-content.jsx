import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  IconButton,
  styled,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '@/contexts/theme-context';
import { Modal } from '@/components/modal/modal';
import { DefaultOrderModalContent } from './components/default-order-modal-content';
import toast from 'react-hot-toast';
// import axios from '@/libs/axios'; // Removed axios
// import { selectDefaultOrders } from '@/features/default-order/default-order.selector'; // Removed selector
// import { useDispatch, useSelector } from 'react-redux'; // Removed useDispatch and useSelector if only used for slice
// import { addDefaultOrder, removeDefaultOrder } from '@/features/default-order/default-order.slice'; // Removed slice actions
import {
    useGetDefaultOrdersQuery,
    useCreateDefaultOrderMutation,
    useDeleteDefaultOrderMutation,
} from '@/features/default-order/defaultOrderApi'; // RTK Query hooks

const Container = styled('div')({
    position: "relative",
    paddingTop: "30px",
})

const AddNewCommand = styled('div')(({ theme }) => ({
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

export const DefaultOrdersList = () => {
    const { data: orders = [], isLoading, isError, error } = useGetDefaultOrdersQuery();
    const [createDefaultOrderMutation, { isLoading: isCreating }] = useCreateDefaultOrderMutation();
    const [deleteDefaultOrderMutation, { isLoading: isDeleting }] = useDeleteDefaultOrderMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOrderName, setNewOrderName] = useState('');
    const theme = useContext(ThemeContext);
    const navigate = useNavigate();

    const columns = [{ id: 'name', label: 'Nom', align: 'left' }];

    const handleDeleteOrder = (orderId, e) => {
        e.stopPropagation();
        deleteDefaultOrderMutation(orderId)
            .unwrap()
            .then(() => {
                toast.success("La commande par défaut a bien été supprimée");
            })
            .catch(() => {
                toast.error("Une erreur est survenue lors de la suppression de la commande par défaut");
            });
    };

    const onCreateClick = () => {
        setIsModalOpen(true);
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
        setNewOrderName('');
    };

    const handleSubmitNewOrder = () => {
        if (!newOrderName.trim()) return;

        createDefaultOrderMutation({ name: newOrderName })
            .unwrap()
            .then(() => {
                setIsModalOpen(false);
                setNewOrderName('');
                toast.success("La commande par défaut a bien été créée");
            })
            .catch(() => {
                toast.error("Une erreur est survenue lors de la création de la commande par défaut");
            });
    };

    const handleEditOrder = (orderId) => {
        navigate(`/default-orders/${orderId}`);
    };

    return (
        <Container>
            <AddNewCommand onClick={onCreateClick} disabled={isCreating || isDeleting}>
                {isCreating ? "Création..." : "+ Créer une nouvelle commande"}
            </AddNewCommand>
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
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} align="center">Chargement...</TableCell>
                            </TableRow>
                        )}
                        {isError && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} align="center">
                                    Erreur: {error?.data?.message || error?.message || 'Impossible de charger les commandes par défaut'}
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && !isError && orders.map((order, rowIndex) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={order.id}>
                                        <TableCell align={"left"}>{rowIndex + 1}</TableCell>
                                        <TableCell align={"left"}>{order.name}</TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton onClick={() => handleEditOrder(order.public_id)} disabled={isDeleting || isCreating}>
                                                <EditIcon style={{ color: theme.colors.primary }} />
                                            </IconButton>
                                            <IconButton onClick={(e) => handleDeleteOrder(order.public_id, e)} disabled={isDeleting || isCreating}>
                                                <DeleteIcon style={{ color: theme.colors.danger }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={isModalOpen} onClose={onCloseModal} width="40%">
                <DefaultOrderModalContent 
                    isNew={true} 
                    name={newOrderName} 
                    handleNameChange={setNewOrderName} 
                    submit={handleSubmitNewOrder} 
                    cancel={onCloseModal} 
                    isLoading={isCreating}
                />
            </Modal>
        </Container>
    );
};
