import React from "react";
import styled from 'styled-components';
import { useParams } from "react-router-dom"

import { ProductWrapper, Pictures, Informations, Description } from "./components"
import axios from "@/libs/axios";


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

    const [product, setProduct] = React.useState(null)

    React.useEffect(() => {
        axios.get(`/products/${productId}`,).then(response => {
            setProduct(response.data.data)
        })
    }, [])

    return (
        product ? (
            <ProductWrapper>
                <Flex>
                    <Pictures product={product} />
                    <Informations product={product} setProduct={setProduct} />
                </Flex>
                <Description product={product} />
                {/* <SimilarProducts>Produits similaires (On garde mais trié par popularité)</SimilarProducts> */}
            </ProductWrapper>
        ) : null
    )
}