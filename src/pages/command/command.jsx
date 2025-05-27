import React from "react"

import { useDispatch, useSelector } from "react-redux"
import { styled } from "@mui/material"
import { useNavigate } from "react-router-dom"

import axios from "@/libs/axios"

import { Address, Summary } from "./components"
import { ModalRPPS } from "./components/modal-rpps"
import { resetCart } from "@/features/basket/basket.slice"
import { selectAddresses } from "@/features/address/address.slice"
import toast from "react-hot-toast"

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
    const cartItems = useSelector(state => state.basket.products)
    const addresses = useSelector(selectAddresses)


    const [address, setAddress] = React.useState(addresses[0]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [RPPS, setRPPS] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (addresses.length > 0) {
            setAddress(addresses[0])
        }
    }, [addresses])

    const submit = () => {
        if (isLoading) {
            return
        }
        const isRPPSValid = RPPS.length === 11 && RPPS.match(/^[0-9]+$/)
        if (protectedItemInCart() && !isRPPSValid) {
            setIsModalOpen(true)
            return
        }
        setIsLoading(true)
        const body = {
            facturation: address.address_informations.facturation,
            delivery: address.address_informations.delivery,
            complementary_informations: address.address_informations.complementary_informations,
            is_same_address: address.address_informations.is_same_address,
            rpps: RPPS,
        }

        axios.post("/orders", body).then((response) => {
            setIsModalOpen(false)
            setRPPS("")
            dispatch(resetCart())
            navigate("/confirmation", { state: { order: response.data }})
            toast.success("Votre commande a bien été enregistrée")
            setIsLoading(false)
        }).catch((error) => {
            setIsLoading(false)
            toast.error("Une erreur est survenue lors de l'enregistrement de votre commande")
        })
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

    if (addresses.length === 0 || address === undefined) {
        return <NoProducts>Aucune adresse n'a été trouvée. Veuillez en créer une depuis la page Profil.</NoProducts>
    }
    return (
        <CommandWrapper>
            <Address addresses={addresses} address={address} setAddress={setAddress} />
            <Summary submit={submit} isLoading={isLoading} />
            <ModalRPPS RPPS={RPPS} setRPPS={(e) => setRPPS(e.target.value)} isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} submit={submit} />
        </CommandWrapper>
    )
}