import React from 'react';

import { Input } from './input';
import { useDispatch, useSelector } from 'react-redux';

import { setSearch as _setSearch} from '../../../../features/search/search.slice'


export const SearchBar = () => {
    const dispatch = useDispatch()
    const setSearch = (text) => dispatch(_setSearch(text))
    const search = useSelector(state => state.search)

    return (
        <>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
            {/* <List /> */}
        </>
    )
}