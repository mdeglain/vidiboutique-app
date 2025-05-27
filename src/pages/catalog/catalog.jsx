import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { styled } from '@mui/system';

import { useGetProductsQuery } from '../../features/product/productApi'; // Import the hook

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

    const [page, setPage] = React.useState(() => parseInt(searchParams.get('page')) || 1); // Ensure page is initialized

    useEffect(() => {
        setPage(1)
    }, [filters])

    useEffect(() => {
        const pageFromUrl = searchParams.get('page');
        if (pageFromUrl) {
            setPage(parseInt(pageFromUrl, 10));
        } else {
            // Set page to 1 if not in URL, and update URL
            searchParams.set('page', '1');
            navigate({ search: searchParams.toString() }, { replace: true });
            setPage(1);
        }
    }, []); // Removed searchParams from dependencies to avoid loop, ensure it runs once

    const buildParams = () => {
        if (isNaN(page) || page < 1) { // Ensure page is valid
            return null
        }
        let params = {
            page: page || 1, // Ensure page is passed to params
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
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Keep scroll to top on page change
    };

    const params = buildParams();
    const {
        data, // Assuming data structure is { items: [], pages: 1 } or similar
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetProductsQuery(params, { skip: !params || !isAuthenticated }); // Skip query if params are null or user not authenticated

    // Extract products and numberOfPages from data
    // Assuming the backend directly returns the object with items and pages
    // If it's nested under another 'data' property, it would be data?.data?.items
    const products = data?.items || [];
    const numberOfPages = data?.pages || 1;


    if (!isAuthenticated) {
        return <NoProducts>Connectez-vous pour voir les produits</NoProducts>;
    }

    if (isLoading || isFetching) {
        return <div>Loading...</div>; // Or a more sophisticated loading indicator
    }

    if (isError) {
        return <div>Error: {error?.message || 'Something went wrong'}</div>; // Display error message
    }

    return (
        <>
            <Flex>
                <Filter />
                <Sorter />
            </Flex>
            {isSuccess && (
                <ProductsWrapper>
                    {products.length === 0 && <NoProducts>Aucun produit ne correspond à votre recherche.</NoProducts>}
                    {products.map(product => (
                        <Product product={product} key={product.id} /> // Removed updateProducts
                    ))}
                </ProductsWrapper>
            )}
            {numberOfPages > 1 && ( // Only show pagination if there's more than one page
                <PaginationWrapper>
                    <Pagination count={numberOfPages} page={page || 1} shape="rounded" onChange={handleChange} />
                </PaginationWrapper>
            )}
        </>
    )
}