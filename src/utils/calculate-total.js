export const calculateTotal = (cartItems, shouldIncludeTva) => {
    let total = 0
    cartItems.forEach(cartItem => {
        if (shouldIncludeTva) {
            total += parseFloat(cartItem.product.price * (1 + cartItem.product.tva.value)) * cartItem.quantity
        } else {
            total += parseFloat(cartItem.product.price) * cartItem.quantity
        }
    })
    return total
}