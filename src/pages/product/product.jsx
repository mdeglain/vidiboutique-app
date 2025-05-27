import React from "react";
import styled from 'styled-components';
import { useParams } from "react-router-dom"

import { ProductWrapper, Pictures, Informations, Description } from "./components"
import { useGetProductByIdQuery } from "../../features/product/productApi";


const Flex = styled.div`
    display: flex;
`

const SimilarProducts = styled.div`
    flex: 1;
    background-color: blue;
    color: white;
    text-align: center;
    height: 150px;
`

export const Product = (props) => {
    const { productId } = useParams()

    const {
        data: product,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetProductByIdQuery(productId);

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.message || 'Something went wrong'}</div>;
    }

    return (
        isSuccess && product ? (
            <ProductWrapper>
                <Flex>
                    <Pictures product={product} />
                    <Informations product={product} /> {/* Removed setProduct, assuming Informations doesn't need it or will be refactored separately */}
                </Flex>
                <Description product={product} />
                {/* <SimilarProducts>Produits similaires (On garde mais trié par popularité)</SimilarProducts> */}
            </ProductWrapper>
        ) : null
    )
}