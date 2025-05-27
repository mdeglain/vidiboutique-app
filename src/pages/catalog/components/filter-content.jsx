import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"

import { FilterView } from "./filter-view"
import { CategoriesView } from "./categories-view"
import { ActionButtons } from "./filter-content-action-buttons";

const Container = styled.div`
    width: 400px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
`

const Content = styled.div`
    overflow: scroll;
    padding: 30px;
    height: calc(100% - 120px);
`

export const FilterContent = (props) => {
    // Get isCategoryOpen from filter store
    const isCategoryOpen = useSelector(state => state.filter.isCategoryOpen)
    return (
        <Container>
            <Content>
                {isCategoryOpen ? <CategoriesView /> : <FilterView />}
            </Content>
            <ActionButtons />
        </Container>
    )
}