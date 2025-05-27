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
import axios from '@/libs/axios';
import { selectDefaultOrders } from '@/features/default-order/default-order.selector';
import { useDispatch, useSelector } from 'react-redux';
import { addDefaultOrder, removeDefaultOrder } from '@/features/default-order/default-order.slice';

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
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const orders = useSelector(selectDefaultOrders)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOrderName, setNewOrderName] = useState('');
    const theme = useContext(ThemeContext);
    const navigate = useNavigate();

    const columns = [{ id: 'name', label: 'Nom', align: 'left' }];

  const handleDeleteOrder = (orderId, e) => {
    e.stopPropagation();
    axios.delete(`/default-orders/${orderId}`).then(response => {
        dispatch(removeDefaultOrder(orderId))
        toast.success("La commande par défaut a bien été supprimée")
    }).catch(_ => {
        toast.error("Une erreur est survenue lors de la suppression de la commande par défaut")
    })
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

    axios.post('default-orders', { name: newOrderName }).then(response => {
        dispatch(addDefaultOrder(response.data.data))
        setIsModalOpen(false)
        setNewOrderName('')
        toast.success("La commande par défaut a bien été créée")
    }).catch(_ => {
        toast.error("Une erreur est survenue lors de la création de la commande par défaut")
    })
  };

  const handleEditOrder = (orderId) => {
    navigate(`/default-orders/${orderId}`);
  };

//   if (loading) {
//     return <Typography>Chargement...</Typography>;
//   }

  return (
    <Container>
            <AddNewCommand onClick={onCreateClick}>+ Créer une nouvelle commande</AddNewCommand>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, columnIndex) => (
                                <>
                                    {columnIndex === 0 ? <TableCell key={0} align={"left"}>N°</TableCell> : null}
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                    {columnIndex === columns.length - 1 ? <TableCell key={0} align={"center"}>Actions</TableCell> : null}
                                </>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders
                            .map((order, rowIndex) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={order.id}>
                                        <TableCell key={rowIndex + 1} align={"left"}>{rowIndex + 1}</TableCell>
                                        <TableCell key={"commandNumber"} align={"left"}>{order.name}</TableCell>
                                        <TableCell key={rowIndex + 1} align={"center"}>
                                            <IconButton onClick={() => handleEditOrder(order.public_id)}>
                                                <EditIcon style={{ color: theme.colors.primary }} />
                                            </IconButton>
                                            <IconButton onClick={(e) => handleDeleteOrder(order.public_id, e)}>
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
            <DefaultOrderModalContent isNew={true} name={newOrderName} handleNameChange={setNewOrderName} submit={handleSubmitNewOrder} cancel={() => setIsModalOpen(false)} />
            </Modal>
        </Container>
  );
};
