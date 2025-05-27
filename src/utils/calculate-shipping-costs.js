import { getProductsBySuppliers } from "./get-products-by-suppliers"


export const calculateShippingCosts = (cartItems) => {
    const productsBySuppliers = getProductsBySuppliers(cartItems)

    let shippingCosts = 0
    for (const supplierPublicId in productsBySuppliers) {
        const supplier = productsBySuppliers[supplierPublicId]
        const total = supplier.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
        const freeShippingCostsAmount = supplier.free_shipping_costs_amount

        if (total < freeShippingCostsAmount) {
            shippingCosts += supplier.shipping_costs
        }
    }

    return shippingCosts
}