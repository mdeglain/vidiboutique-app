import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { styled, Modal, Typography, IconButton, Box } from '@mui/material';

import { ShippingCostAdvice } from "./shipping-cost-advice"

import { eur } from "@/utils/format"
import { calculateTotal, calculateShippingCosts } from "@/utils"
import axios from "@/libs/axios"
import toast from "react-hot-toast"
import { selectAdminOrders, selectOrders, setAdminOrders } from "@/features/orders/orders.slice";
import { FaSquareCheck, FaSquareXmark } from "react-icons/fa6";
import { ThemeContext } from "@/contexts/theme-context";

const StyledBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    boxShadow: 24,
    padding: "20px",
    backgroundColor: theme.colors.white,
}))

const TextArea = styled("textarea")(({ theme }) => ({
    width: "100%",
    height: "70px",
    border: "1px solid #000",
    padding: "5px",
    margin: "5px 0",
    backgroundColor: theme.colors.grey[100],
    color: theme.colors.black,
}));

const Buttons = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
}));

const CheckoutWrapper = styled("div")(({ theme }) => ({
    padding: "20px 0px",
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
    alignItems: "flex-end",
    borderTop: `solid ${theme.colors.grey[300]} 1px`,
}))

const TotalWrapper = styled("div")({
    display: "flex",
    flexDirection: "column",
    padding: "20px 0px",
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
})

const PriceWrapper = styled("div")({
    display: "flex",
    // flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
})

const TotalText = styled("div")(({ theme }) => ({
    color: theme.colors.grey[500],
    fontSize: theme.fontSizes.xl,
    marginRight: "5px",
}))

const TotalPrice = styled("div")(({ theme }) => ({
    textAlign: "right",
    color: theme.colors.orange,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.xl,
}))

const ButtonWrapper = styled("div")({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
})

const Button = styled("button")(({ theme, disabled, color }) => ({
    backgroundColor: theme.colors[color],
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    padding: "10px 20px",
    margin: "5px 0px 5px 10px",
    borderRadius: "4px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    "&:focus, &:hover": {
        outline: "none",
    },
}))

export const Checkout = ({ isEditable, order, setOrder }) => {
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [message, setMessage] = React.useState("Pas de commentaire");
    const [selectedOrder, setSelectedOrder] = React.useState(null)
    const [selectedOrderStatus, setSelectedOrderStatus] = React.useState(null)
    const orderItems = order?.order_items || []
    const orders = isEditable ? useSelector(selectAdminOrders) : useSelector(selectOrders)

    const theme = React.useContext(ThemeContext)

    const writeMessage = (order, status) => {
        setSelectedOrder(order)
        setSelectedOrderStatus(status)
        setMessage("Pas de commentaire")
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setMessage("Pas de commentaire")
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

    const total_ht = calculateTotal(orderItems, false)
    const total_ttc = calculateTotal(orderItems, true)
    const shipping_costs = calculateShippingCosts(orderItems)
    const total = total_ttc + shipping_costs

    return (
        <CheckoutWrapper>
            <ShippingCostAdvice orderItems={orderItems} />
            <TotalWrapper>
                <PriceWrapper>
                    <TotalText>Total HT :</TotalText>
                    <TotalPrice>{eur(total_ht)}</TotalPrice>
                </PriceWrapper>
                <PriceWrapper>
                    <TotalText>Total TTC :</TotalText>
                    <TotalPrice>{eur(total_ttc)}</TotalPrice>
                </PriceWrapper>
                <PriceWrapper>
                    <TotalText>Frais de livraison :</TotalText>
                    <TotalPrice>{eur(shipping_costs)}</TotalPrice>
                </PriceWrapper>
                <PriceWrapper>
                    <TotalText>Total :</TotalText>
                    <TotalPrice>{eur(total)}</TotalPrice>
                </PriceWrapper>
            </TotalWrapper>
            {isEditable && 
                <ButtonWrapper>
                    <Button onClick={(e) => {
                        e.stopPropagation()
                        writeMessage(order, "APPROVED")
                    }} color={"success"}>Accepter</Button>
                    <Button onClick={(e) => {
                        e.stopPropagation()
                        writeMessage(order, "REFUSED")
                    }} color={"danger"}>Refuser</Button>
                </ButtonWrapper>
            }
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                >
                <StyledBox>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    Message
                    </Typography>
                    <TextArea disabled={isEditable ? false : true} onChange={(e) => setMessage(e.target.value)}>{message}</TextArea>

                    <Buttons>
                        {
                            isEditable ? (
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
        </CheckoutWrapper>
    )
}