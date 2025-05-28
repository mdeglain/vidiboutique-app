import React, { useState, useEffect } from "react";
import { styled, TextField } from "@mui/material";
// import axios from "@/libs/axios"; // Removed axios

import { Label } from "@/components"

const InputWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& > div": {
        width: "100%"
    }
}))

const TextFieldWrapper = styled(TextField)(({ theme }) => ({
    width: "100%",
}))

const Title = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.title,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    textDecoration: "underline",
}))

export const OrderName = ({ initialName, onNameChange }) => { // publicId removed, onNameChange added
    const [isEditing, setIsEditing] = useState(false);
    const [currentName, setCurrentName] = useState(initialName);

    useEffect(() => {
        setCurrentName(initialName);
    }, [initialName]);

    const handleChange = (e) => {
        setCurrentName(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (currentName !== initialName) {
            onNameChange(currentName); // Call the callback prop
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur(); // Or directly call onNameChange if preferred
        }
    };

    const handleClick = () => {
        setIsEditing(true);
    };

    return (
        <InputWrapper>
            {isEditing ? (
                <TextFieldWrapper 
                    size="small"
                    variant="outlined"
                    value={currentName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown} // Added Enter key handler
                    autoFocus 
                />
            ) : (
                <Title onClick={handleClick} style={{ cursor: "pointer" }}>
                    {currentName || "Cliquez pour ajouter un nom"}
                </Title>
            )}
            
        </InputWrapper>
    );
};
