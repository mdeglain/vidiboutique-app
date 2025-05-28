import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';

import { Product } from "./product"

const ProductsWrapper = styled("div")(({ theme }) => ({
    "& > div:not(:last-child)": {
        borderBottom: `solid ${theme.colors.grey[300]} 1px`,
    }
}))

export const ProductList = ({ items, onUpdateItemQuantity, onDeleteItem, onAddItem }) => { 
    // Removed defaultOrder, added onUpdateItemQuantity, onDeleteItem, onAddItem
    // Assuming onAddItem is for adding a new product to the list, which might be initiated from elsewhere
    // but ProductList might render an "Add Product" button or similar.
    // For now, focusing on passing down existing item handlers.
    return (
        <ProductsWrapper>
            {
                items.map((item, index) => {
                    return (
                        <Product 
                            key={item.product_id || index} // Use a stable key like product_id
                            item={item} 
                            // defaultOrder prop removed, Product component will need to be refactored
                            // to not expect defaultOrder if it was using it for anything other than items.
                            onUpdateQuantity={(newQuantity) => onUpdateItemQuantity(item.product_id, newQuantity)}
                            onDelete={() => onDeleteItem(item.product_id)}
                        />
                    );
                })
            }
            {/* Placeholder for adding new products if that's part of ProductList's role */}
            {/* <button onClick={() => onAddItem({ product_id: 'new_product_id_example', quantity: 1, ...other_product_details })}>Add New Product</button> */}
        </ProductsWrapper>
    )
}