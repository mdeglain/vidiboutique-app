import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { styled } from '@mui/system';

import axios from "@/libs/axios";

import { ProductsWrapper, PaginationWrapper, Product, Filter } from './components';
import { selectIsAuth } from '@/features/auth/auth.selector';
import { Sorter } from './components/sorter';
import { selectSort } from '@/features/filter/filter.slice';

const NUMBER_OF_PRUDUCTS_PER_PAGE = 20;

const NoProducts = styled('div')({
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: '20px 0',
    color: '#888',
    width: '100%',
    height: 'calc(100vh - 351px - 100px)',
    lineHeight: 'calc(100vh - 351px - 100px)',
})

const Flex = styled('div')({
    display: "flex"
})

export const Catalog = () => {
    const filters = useSelector(state => state.filter.savedFilters)
    const sort = useSelector(selectSort)
    const search = useSelector(state => state.search.savedSearch)
    const isSearchActivated = useSelector(state => state.search.isSearchActivated)
    const isAuthenticated = useSelector(selectIsAuth)

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [page, setPage] = React.useState(() => parseInt(searchParams.get('page')));
    const [numberOfPages, setNumberOfPages] = React.useState(1);
    const [products, setProducts] = React.useState([]);

    useEffect(() => {
        setPage(1)
    }, [filters])

    useEffect(() => {
        const pageFromUrl = searchParams.get('page');
        if (pageFromUrl) {
            setPage(parseInt(pageFromUrl, 10));
        }
    }, []);

    useEffect(() => {
        const params = buildParams()
        if (params) {
            axios.get('/products', { params }).then(response => {
                setProducts(response.data.data.items)
                setNumberOfPages(response.data.data.pages)
            })
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page, filters, search, isAuthenticated, sort])

    const updateProducts = ({ id, newProduct }) => {
        const newProducts = products.map(product => {
            if (product.id === id) {
                return newProduct
            }
            return product
        })
        setProducts(newProducts)
    }

    const buildParams = () => {
        if (isNaN(page)) {
            return null
        }
        let params = {
            page: page,
            per_page: NUMBER_OF_PRUDUCTS_PER_PAGE,
            is_recommanded: filters.isVidiChoiceActivated ? true : null,
            is_best_seller: filters.isBestSellsActivated ? true : null,
            is_free_shipping: filters.isFreeShippingActivated ? true : null,
            is_on_sale: filters.isReductionActivated ? true : null,
            is_favorite: filters.isFavoriteActivated ? true : null,

        }

        if (isSearchActivated) {
            params.q = search
        }
        if (filters.activeCategoryId) {
            params.category_id = filters.activeCategoryId
        }
        if (filters.isPriceActivated) {
            params.max_price = filters.priceRange.maximum
        }

        if (sort.type === "down") {
            params.order_by_asc = sort.value
        } else {
            params.order_by_desc = sort.value
        }

        return params
    }
    const handleChange = (_, value) => {
        searchParams.set('page', value);
        navigate({ search: searchParams.toString() });
        setPage(value)
    };

    return (
        <>
            {
                isAuthenticated ? (
                    <React.Fragment>
                        <Flex>
                            <Filter />
                            <Sorter />
                        </Flex>
                        <ProductsWrapper>
                            {products.length === 0 && <NoProducts>Aucun produit ne correspond à votre recherche.</NoProducts>}
                            {products.map(product => (
                                <Product product={product} key={product.id} updateProducts={updateProducts}/>
                            ))}
                        </ProductsWrapper>
                        <PaginationWrapper>
                            <Pagination count={numberOfPages} page={page} shape="rounded" onChange={handleChange} />
                        </PaginationWrapper>
                    </React.Fragment>
                ) : (
                    <NoProducts>Connectez-vous pour voir les produits</NoProducts>
                )
            }
        </>
    )
}