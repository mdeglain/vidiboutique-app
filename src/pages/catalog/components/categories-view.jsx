import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"

import { useDispatch } from "react-redux"
import { setActiveCategoryId as setActiveCategoryIdStore } from "@/features/filter/filter.slice"


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
    const dispath = useDispatch()
    const categories = useSelector(state => state.category.categories)
    const activeCategoryId = useSelector(state => state.filter.activeCategoryId)

    const [categoriesTree, setCategoriesTree] = useState({})

    const setActiveCategoryId = (categoryId) => {
        dispath(setActiveCategoryIdStore(categoryId))
    }

    const getParentsIds = () => {
        const parentsIds = []
        let currentCategoryId = activeCategoryId
        while (currentCategoryId !== null) {
            const currentCategory = categories.find(category => category.id === currentCategoryId)
            parentsIds.push(currentCategory.id)
            currentCategoryId = currentCategory.main_category_id
        }
        return parentsIds.reverse()
    }

    const formatCategories = (parentsIds, categoryId, shouldStop = false) => {
        const category = categories.find(category => category?.id === categoryId);

        if (shouldStop) {
            return {
                id: categoryId,
                name: category.name,
                children: []
            }
        }

        let children = categories.filter(category => category.main_category_id === categoryId);

        if (children.length !== 0) {
            const childrenFiltered = children.filter(child => parentsIds.includes(child.id))
            if (childrenFiltered.length !== 0) {
                children = childrenFiltered
            }
        }

        return {
            id: categoryId,
            name: category ? category.name : null,
            children: children.map(child => formatCategories(parentsIds, child.id, (categoryId === activeCategoryId)))
        };
    }

    const getCategoriesTreeToDisplay = () => {
        const parentsIds = getParentsIds()
        return formatCategories(parentsIds, parentsIds[0] || activeCategoryId)
    }

    useEffect(() => {
        setCategoriesTree(getCategoriesTreeToDisplay())
    }, [activeCategoryId])

    const displayCategories = (category, depth = 0) => {
        return (
            <React.Fragment>
                {category.id ? <Category style={{ paddingLeft: `calc(8px + ${depth} * 15px)`, fontWeight: category.id === activeCategoryId ? 'bold' : 'normal' }} onClick={() => setActiveCategoryId(category.id)}>{category.name}</Category> : null}
                {category.children.map(child => displayCategories(child, depth + 1))}
            </React.Fragment>
        )
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