import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { styled, Modal, Typography, IconButton, Box } from '@mui/material';

import { ShippingCostAdvice } from "./shipping-cost-advice"

import { eur } from "@/utils/format"
import { calculateTotal, calculateShippingCosts } from "@/utils"
// import axios from "@/libs/axios" // Removed axios
import toast from "react-hot-toast"
// import { selectAdminOrders, selectOrders, setAdminOrders } from "@/features/orders/orders.slice"; // Removed slice imports
import { useUpdateOrderStatusMutation } from "@/features/order/orderApi"; // RTK Query hook
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

export const Checkout = ({ isEditable, order }) => { // Removed setOrder prop
    // const dispatch = useDispatch() // Removed dispatch
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [message, setMessage] = React.useState("Pas de commentaire");
    // selectedOrder and selectedOrderStatus will now directly use the 'order' prop from parent
    // const [selectedOrder, setSelectedOrder] = React.useState(null) 
    // const [selectedOrderStatus, setSelectedOrderStatus] = React.useState(null)
    const [currentActionStatus, setCurrentActionStatus] = React.useState(null); // To store 'APPROVED' or 'REFUSED' for modal

    const orderItems = order?.order_items || []
    // const orders = isEditable ? useSelector(selectAdminOrders) : useSelector(selectOrders) // Removed selector

    const theme = React.useContext(ThemeContext)
    const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

    const writeMessage = (status) => { // order prop is already available in the component scope
        setCurrentActionStatus(status); // Set whether it's an approve or refuse action
        setMessage(order?.message || "Pas de commentaire"); // Pre-fill with existing message if any, or default
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setMessage("Pas de commentaire"); // Reset message on close
        setCurrentActionStatus(null);
    }

    const handleStatusUpdate = () => {
        if (!order || !currentActionStatus) return;

        updateOrderStatus({ public_id: order.public_id, status: currentActionStatus, message })
            .unwrap()
            .then(() => {
                toast.success(`Commande ${currentActionStatus === 'APPROVED' ? 'acceptée' : 'refusée'}.`);
                closeModal();
                // The order data in parent (order.jsx) will be updated automatically by RTK Query cache invalidation
            })
            .catch((err) => {
                toast.error(err?.data?.message || "Erreur lors de la mise à jour de la commande.");
            });
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
                        e.stopPropagation();
                        writeMessage("APPROVED");
                    }} color={"success"} disabled={isUpdatingStatus}>Accepter</Button>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        writeMessage("REFUSED");
                    }} color={"danger"} disabled={isUpdatingStatus}>Refuser</Button>
                </ButtonWrapper>
            }
            <Modal
                open={isModalOpen}
                onClose={closeModal} // Use closeModal directly
                >
                <StyledBox>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    Message pour {currentActionStatus === 'APPROVED' ? 'acceptation' : 'refus'}
                    </Typography>
                    <TextArea 
                        disabled={!isEditable || isUpdatingStatus} 
                        onChange={(e) => setMessage(e.target.value)} 
                        value={message} // Controlled component
                    />
                    <Buttons>
                        {isEditable ? (
                            <>
                            <Button onClick={closeModal} color={"primary"} disabled={isUpdatingStatus}>Fermer</Button>
                            <Button 
                                color={currentActionStatus === "APPROVED" ? "success" : "danger"}
                                onClick={handleStatusUpdate}
                                disabled={isUpdatingStatus}
                            >
                                {isUpdatingStatus ? 'En cours...' : (currentActionStatus === "APPROVED" ? "Valider" : "Refuser")}
                            </Button>
                            </>
                        ) : (
                            <Button onClick={closeModal} color={"primary"}>Fermer</Button>
                        )}
                    </Buttons>
                </StyledBox>
            </Modal>
        </CheckoutWrapper>
    )
}