import * as React from 'react';
import { useTheme } from '@mui/material/styles';


import { Box, Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, IconButton, styled, Modal, Typography } from '@mui/material';


import {
    Download as DownloadIcon,
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    LastPage as LastPageIcon
} from '@mui/icons-material';
import { MdMessage } from "react-icons/md";


import { FaSquareCheck, FaSquareXmark } from "react-icons/fa6";

import { ThemeContext } from '@/contexts/theme-context';
import axios from '@/libs/axios';
import { calculateShippingCosts, calculateTotal, eur } from '@/utils';
import { format } from 'date-fns';
import { selectUser } from '@/features/auth/user.selector';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { selectAdminOrders, selectOrders, setAdminOrders } from '@/features/orders/orders.slice';

const StyledTableRow = styled(TableRow)(({ status }) => ({
    background: status === "REJECTED" ? "rgba(202, 31, 31, 0.2)" : status === "APPROVED" ? "rgba(45, 167, 45, 0.2)": "none",
    "&:hover": {
        cursor: "pointer"
    }
}))

const StyledBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    boxShadow: 24,
    padding: "20px",
    backgroundColor: theme.colors.white,
}));

const Buttons = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
}));

const Button = styled("button")(({ theme, color }) => ({
    flex: 1,
    height: "30px",
    border: "1px solid #000",
    padding: "5px",
    margin: "5px 0px 5px 10px",
    backgroundColor: theme.colors[color],
    color: theme.colors.white,
}));

const TextArea = styled("textarea")(({ theme }) => ({
    width: "100%",
    height: "70px",
    border: "1px solid #000",
    padding: "5px",
    margin: "5px 0",
    backgroundColor: theme.colors.grey[100],
    color: theme.colors.black,
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const columns = [
    { id: 'id', label: 'N° de commande', align: 'left' },
    { id: 'createdAt', label: 'Date', align: 'left' },
    { id: 'address', label: 'Adresse', align: 'left' },
    { id: 'price', label: 'Montant TTC', align: 'left' },
    { id: 'status', label: 'État', align: 'left' },
    { id: 'createdBy', label: 'Créée par', align: 'left' },
    { id: 'message', label: 'Message', align: 'left' },

];

export const OrdersList = ({ isAdmin }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [message, setMessage] = React.useState("Pas de commentaire");
    const [selectedOrder, setSelectedOrder] = React.useState(null)
    const [selectedOrderStatus, setSelectedOrderStatus] = React.useState(null)
    const orders = isAdmin ? useSelector(selectAdminOrders) : useSelector(selectOrders)

    const theme = React.useContext(ThemeContext)


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const openPdfOrder = (order) => {
        window.open(order.pdf_url, '_blank');
    }

    const validateOrRefuseOrder = ({ order, status }) => {
        axios.patch(`/orders/${order.public_id}`, {status, message}).then(response => {
            const updatedOrder = response.data.data
            const updatedOrders = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
            dispatch(setAdminOrders(updatedOrders))
            setMessage("Pas de commentaire")
            setIsModalOpen(false)
        }).catch(error => {
            toast.error("Erreur lors de la modification de la commande")
        })
    }

    const getOrderPrice = (order) => {
        if (order.order_items.length === 0) {
            return "-"
        }
        const total_ttc = calculateTotal(order.order_items, true)
        const shipping_costs = calculateShippingCosts(order.order_items)
        return eur(total_ttc + shipping_costs)
    }

    const getStatus = (order) => {
        if (order.status === "PENDING") {
            return "En attente"
        } else if (order.status === "APPROVED") {
            return "Validée"
        } else if (order.status === "REJECTED") {
            return "Refusée"
        }
    }

    const goToOrder = (order) => {
        navigate(`/orders/${order.public_id}`, { state: { isAdmin}})
    }

    const getCreator = (order) => {
        return `${order.user.first_name} ${order.user.last_name}`
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setMessage("Pas de commentaire")
    }

    const writeMessage = (order, status) => {
        setSelectedOrder(order)
        setSelectedOrderStatus(status)
        setMessage("Pas de commentaire")
        setIsModalOpen(true)
    }

    return (
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
                                {columnIndex === columns.length - 1 ? <TableCell key={0} align={"center"}>Action</TableCell> : null}
                            </>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((order, rowIndex) => {
                            const date = new Date(order.created_at);
                            const offset = date.getTimezoneOffset();
                            const localDate = new Date(date.getTime() - offset * 60000);
                            // const timeZone = 'Europe/Paris'; // replace with your timezone
                            const formattedDate = format(localDate, 'yyyy/MM/dd HH:mm')
                            return (
                                <StyledTableRow hover role="checkbox" tabIndex={-1} key={order.id} onClick={() => goToOrder(order)} status={order.status}>
                                    <TableCell key={rowIndex + 1} align={"left"}>{rowIndex + 1}</TableCell>
                                    <TableCell key={"commandNumber"} align={"left"}>{order.id}</TableCell>
                                    <TableCell key={"createdAt"} align={"left"}>{formattedDate}</TableCell>
                                    <TableCell key={"address"} align={"left"}>{order.order_informations.delivery.address}, {order.order_informations.delivery.city}</TableCell>
                                    <TableCell key={"price"} align={"left"}>{getOrderPrice(order)}</TableCell>
                                    <TableCell key={"status"} align={"left"}>{getStatus(order)}</TableCell>
                                    <TableCell key={"createdBy"} align={"left"}>{getCreator(order)}</TableCell>
                                    <TableCell key={"message"} align={"left"}>{
                                        order.message && (
                                            <IconButton
                                                    aria-label="approve"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setIsModalOpen(true)
                                                        setMessage(order.message)
                                                    }}
                                                >
                                                    <MdMessage style={{ color: theme.colors.primary }} />
                                                </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell key={rowIndex + 1} align={"center"}>
                                        {/* <div></div> */}
                                        {isAdmin && order.status === "PENDING" ? (
                                            <>
                                                <IconButton
                                                    aria-label="approve"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        writeMessage(order, "APPROVED")
                                                    }}
                                                >
                                                    <FaSquareCheck style={{ color: theme.colors.success }} />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="refuse"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        writeMessage(order, "REFUSED")
                                                    }}
                                                >
                                                    <FaSquareXmark style={{ color: theme.colors.danger }} />
                                                </IconButton>
                                            </>
                                        ): (order.pdf_url && order.status === "APPROVED") ? (
                                            <IconButton
                                                aria-label="download"
                                                onClick={() => {
                                                    openPdfOrder(order)
                                                }}
                                            >
                                                <DownloadIcon style={{ color: theme.colors.primary }} />
                                            </IconButton>
                                        ) : null}
                                    </TableCell>
                                </StyledTableRow>
                            );
                        })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: orders.length }]}
                            colSpan={3}
                            count={orders.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            labelRowsPerPage={"Lignes par page:"}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                >
                <StyledBox>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    Message
                    </Typography>
                    <TextArea disabled={isAdmin ? false : true} onChange={(e) => setMessage(e.target.value)}>{message}</TextArea>

                    <Buttons>
                        {
                            isAdmin ? (
                                <>
                                <Button onClick={closeModal} color={"primary"} onClick={closeModal}>Fermer</Button>
                                <Button 
                                    onClick={closeModal}
                                    color={selectedOrderStatus === "APPROVED" ? "success" : "danger"}
                                    onClick={() => validateOrRefuseOrder({order: selectedOrder, status: selectedOrderStatus})}
                                >{selectedOrderStatus === "APPROVED" ? "Valider" : "Refuser"}</Button>
                                </>
                            ) : (
                                // <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <Button onClick={closeModal} color={"primary"}>Fermer</Button>
                                // </Typography>
                            )
                        }
                    </Buttons>
                </StyledBox>
            </Modal>
        </TableContainer>
    );
}