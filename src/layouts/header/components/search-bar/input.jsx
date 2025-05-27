import React, { useContext } from 'react'
import { TfiSearch } from 'react-icons/tfi'
import { Wrapper } from './wrapper'
import { TextInput } from './text-input'
import { AdornmentWrapper } from './adornment-wrapper'

import { ThemeContext } from "../../../../contexts/theme-context"
import { setIsSearchActivated as _setIsSearchActivated } from "../../../../features/search/search.slice"
import { useDispatch } from 'react-redux'

export const Input = ({ search, onChange }) => {
    const dispatch = useDispatch()
    const theme = useContext(ThemeContext);

    const setIsSearchActivated = () => dispatch(_setIsSearchActivated(true))

    const iconStyle = {
        color: theme.colors.white,
        width: '23px',
        height: '23px',
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsSearchActivated()
        }
    }

    return (
        <Wrapper>
            <TextInput
                placeholder="Recherche par article, référence..."
                value={search}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
            <AdornmentWrapper onClick={setIsSearchActivated}>
                <TfiSearch style={iconStyle} />
            </AdornmentWrapper>
        </Wrapper>
    )
}