import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

export const SearchRedirect = () => {
    const navigate = useNavigate();
    const isSearchActivated = useSelector(state => state.search.isSearchActivated);
    const submitSearch = useSelector(state => state.search.submitSearch);

    useEffect(() => {
        if (isSearchActivated) {
            navigate(`/`)
        }
    }, [isSearchActivated, submitSearch]);

    return null;
};