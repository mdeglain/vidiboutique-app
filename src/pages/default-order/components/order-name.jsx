import React, { useState, useEffect } from "react";
import { styled, TextField } from "@mui/material";
import axios from "@/libs/axios";

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

export const OrderName = ({ orderName, publicId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(orderName);

    useEffect(() => {
        setName(orderName);
    }, [orderName]);

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const handleBlur = async () => {
        if (name !== orderName) {
            try {
                await axios.put(`/default-orders/${publicId}`, {
                    name
                });
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating order name:", error);
            }
        } else {
            setIsEditing(false);
        }
    };

    const handleClick = () => {
        setIsEditing(true);
    };

    // if (!order) return null;

    return (
        <InputWrapper>
            {isEditing ? (
                <TextFieldWrapper size="small"
                    variant="outlined"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus />
            ) : (
                <Title onClick={handleClick} style={{ cursor: "pointer" }}>
                    {name || "Cliquez pour ajouter un nom"}
                </Title>
            )}
            
        </InputWrapper>
    );
};
