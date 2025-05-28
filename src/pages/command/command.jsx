import React from "react"

import React from "react"; // Ensure React is imported
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

// import axios from "@/libs/axios"; // Removed axios
import { useGetAddressesQuery } from "@/features/address/addressApi"; // RTK Query hook for addresses
import { useCreateOrderMutation } from "@/features/order/orderApi"; // RTK Query hook for order creation

import { Address, Summary } from "./components";
import { ModalRPPS } from "./components/modal-rpps";
import { resetCart } from "@/features/basket/basket.slice";
// import { selectAddresses } from "@/features/address/address.slice"; // Removed old selector
import toast from "react-hot-toast";

const CommandWrapper = styled("div")(({ theme }) => ({
    // padding: "20px 20px",
    display: "flex",
    justifyContent: "space-between",
    // alignItems: "flex-start",
}))

const NoProducts = styled('div')({
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: '20px 0',
    color: '#888',
    width: '100%',
    height: 'calc(100vh - 351px - 100px)',
    lineHeight: 'calc(100vh - 351px - 100px)',
})

export const Command = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.basket.products);

    const { data: addressesFromApi, isLoading: isLoadingAddresses, isError: isErrorAddresses } = useGetAddressesQuery();
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

    const [address, setAddress] = React.useState(null); // Initialize with null
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [RPPS, setRPPS] = React.useState("");
    // const [isLoading, setIsLoading] = React.useState(false); // Replaced by isCreatingOrder

    React.useEffect(() => {
        if (addressesFromApi && addressesFromApi.length > 0 && !address) { // Set address only if not already set or if addressesFromApi changes
            setAddress(addressesFromApi[0]);
        } else if (addressesFromApi && addressesFromApi.length === 0) {
            setAddress(null); // No addresses available
        }
    }, [addressesFromApi, address]); // Added address to dependency array to prevent re-setting if it's already selected by user

    const submit = () => {
        if (isCreatingOrder) { // Check RTK Query loading state
            return;
        }
        if (!address) { // Check if an address is selected/available
            toast.error("Veuillez sélectionner ou créer une adresse de livraison.");
            return;
        }
        const isRPPSValid = RPPS.length === 11 && RPPS.match(/^[0-9]+$/);
        if (protectedItemInCart() && !isRPPSValid) {
            setIsModalOpen(true);
            return;
        }
        // setIsLoading(true); // Removed, isCreatingOrder handles this
        const body = {
            facturation: address.address_informations.facturation,
            delivery: address.address_informations.delivery,
            complementary_informations: address.address_informations.complementary_informations,
            is_same_address: address.address_informations.is_same_address,
            rpps: RPPS,
        };

        createOrder(body)
            .unwrap()
            .then((response) => { // Assuming response directly contains the order data (response.data from axios)
                setIsModalOpen(false);
                setRPPS("");
                // dispatch(resetCart()); // Removed - Cart invalidation should handle this
                navigate("/confirmation", { state: { order: response } }); // RTK Query often returns the direct data
                toast.success("Votre commande a bien été enregistrée");
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Une erreur est survenue lors de l'enregistrement de votre commande");
            });
            // .finally(() => { // isCreatingOrder automatically handles this
            //     setIsLoading(false); 
            // });
    }

    const protectedItemInCart = () => {
        let protectedItem = false
        cartItems.forEach(cartItem => {
            if (cartItem.product.is_protected === true) {
                protectedItem = true
            }
        })
        return protectedItem
    }

    if (isLoadingAddresses) {
        return <NoProducts>Chargement des adresses...</NoProducts>; 
    }

    if (isErrorAddresses || !addressesFromApi || addressesFromApi.length === 0 || !address) {
        return <NoProducts>Aucune adresse n'a été trouvée. Veuillez en créer une depuis la page Profil.</NoProducts>;
    }

    return (
        <CommandWrapper>
            <Address addresses={addressesFromApi} address={address} setAddress={setAddress} />
            <Summary submit={submit} isLoading={isCreatingOrder} /> {/* Use isCreatingOrder */}
            <ModalRPPS RPPS={RPPS} setRPPS={(e) => setRPPS(e.target.value)} isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} submit={submit} />
        </CommandWrapper>
    )
}