import React, { useEffect, useState } from "react"; // Removed useContext as it's not used
import { useSelector, useDispatch } from "react-redux"; // Keep useDispatch
import styled from "styled-components";
import { CircularProgress, Typography } from "@mui/material"; // For loading/error states

import { useGetCategoriesQuery } from "@/features/category/categoryApi"; // RTK Query hook
import { setActiveCategoryId as setActiveCategoryIdStore } from "@/features/filter/filter.slice";


const Title = styled.div`
    font-size: ${props => props.theme.fontSizes.title}
`

const Category = styled.div`
    display: block;
    font-size: ${props => props.theme.fontSizes.m};
    padding-top: ${props => props.theme.space.medium};
    padding-left: ${props => props.theme.space.medium};
    padding-bottom: ${props => props.theme.space.medium};
    font-weight: ${props => props.theme.fontWeights.medium};
    border-bottom: 1px solid ${props => props.theme.colors.grey[100]};
    color: ${props => props.theme.colors.grey[600]};
    // text-decoration: underline;
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.colors.secondary};
    }
`

const Container = styled.div`
    margin-top: ${props => props.theme.space.large};
`

export const CategoriesView = () => {
    const dispatch = useDispatch(); // Corrected variable name from dispath to dispatch
    const activeCategoryId = useSelector(state => state.filter.activeCategoryId);

    const { data: categoriesData, isLoading, isError, error } = useGetCategoriesQuery();
    const categories = categoriesData?.data || []; // Adjust based on actual API response

    const [categoriesTree, setCategoriesTree] = useState({});

    const setActiveCategoryId = (categoryId) => {
        dispatch(setActiveCategoryIdStore(categoryId));
    }

    // Ensure categories is populated before attempting to build the tree
    const getParentsIds = () => {
        if (!categories || categories.length === 0) return [];
        const parentsIds = [];
        let currentCategoryId = activeCategoryId;
        while (currentCategoryId !== null) {
            const currentCategory = categories.find(category => category.id === currentCategoryId);
            if (!currentCategory) break; // Category not found, break loop
            parentsIds.push(currentCategory.id);
            currentCategoryId = currentCategory.main_category_id;
        }
        return parentsIds.reverse();
    }

    const formatCategories = (parentsIds, categoryId, shouldStop = false) => {
        if (!categories || categories.length === 0) return { id: categoryId, name: null, children: [] };
        const category = categories.find(cat => cat?.id === categoryId);

        if (!category) return { id: categoryId, name: 'Catégorie inconnue', children: [] }; // Handle case where category might not be found

        if (shouldStop) {
            return {
                id: categoryId,
                name: category.name,
                children: []
            };
        }

        let children = categories.filter(cat => cat.main_category_id === categoryId);

        if (children.length !== 0) {
            const childrenFiltered = children.filter(child => parentsIds.includes(child.id));
            if (childrenFiltered.length !== 0) {
                children = childrenFiltered;
            }
        }

        return {
            id: categoryId,
            name: category.name,
            children: children.map(child => formatCategories(parentsIds, child.id, (categoryId === activeCategoryId)))
        };
    }

    const getCategoriesTreeToDisplay = () => {
        if (!categories || categories.length === 0 || activeCategoryId === undefined) return {}; // Guard against undefined activeCategoryId for initial load
        const parentsIds = getParentsIds();
        if (parentsIds.length === 0 && activeCategoryId !== null) { // If activeId is set but no parents (e.g. top level, or bad ID)
            const activeCat = categories.find(c => c.id === activeCategoryId);
            if (activeCat) return formatCategories([activeCategoryId], activeCategoryId); // Build tree for only this cat
            return {}; // Or handle as error/empty
        }
        if (parentsIds.length === 0 && activeCategoryId === null) { // "Toutes les catégories" is active
             // Display all top-level categories
            const topLevelCategories = categories.filter(c => c.main_category_id === null);
            return {
                id: null, // Virtual root
                name: "Toutes les catégories",
                children: topLevelCategories.map(child => formatCategories([], child.id, false)) // Build shallow tree for top levels
            };
        }
        return formatCategories(parentsIds, parentsIds[0] || activeCategoryId);
    }
    
    useEffect(() => {
        if (categories && categories.length > 0) { // Ensure categories are loaded
            setCategoriesTree(getCategoriesTreeToDisplay());
        }
    }, [activeCategoryId, categories]); // Add categories to dependency array

    const displayCategories = (category, depth = 0) => {
        if (!category || !category.id && category.name !== "Toutes les catégories") return null; // Don't render if category is null or invalid (unless it's the virtual root)
        
        return (
            <React.Fragment>
                {category.id && <Category style={{ paddingLeft: `calc(8px + ${depth} * 15px)`, fontWeight: category.id === activeCategoryId ? 'bold' : 'normal' }} onClick={() => setActiveCategoryId(category.id)}>{category.name}</Category>}
                {category.children && category.children.map(child => displayCategories(child, depth + (category.id === null ? 0 : 1)))} 
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Title>Catégories</Title>
            <Container>
                <Category style={{ fontWeight: activeCategoryId === null ? 'bold' : 'normal' }} onClick={() => setActiveCategoryId(null)}>Toutes les catégories</Category>
                {Object.keys(categoriesTree).length !== 0 ? displayCategories(categoriesTree, activeCategoryId ? 1 : 0) : null}
            </Container>
        </React.Fragment>
    )
}