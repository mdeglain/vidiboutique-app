export const getProductsBySuppliers = (cartItems) => {
    const suppliers = {}

    cartItems.forEach(item => {
        const product = item.product
        if (suppliers[product.supplier.public_id]) {
            suppliers[product.supplier.public_id].items.push(item)
        } else {
            suppliers[product.supplier.public_id] = {
                "name": product.supplier.name,
                "shipping_costs": product.supplier.shipping_costs,
                "free_shipping_costs_amount": product.supplier.free_shipping_costs_amount,
                "items": [item]
            }
        }
    })

    return suppliers
}