import React from "react";
import { styled } from "@mui/material";

const LabelWrapper = styled("div")(({ theme }) => ({
    fontSize: theme.fontSizes.l,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.primary,
    marginBottom: "3px"
}))

export const Label = ({ isRequired, children }) => {
    return (
        <LabelWrapper>
            {children}
            {isRequired && <span style={{ color: "red" }}> *</span>}
        </LabelWrapper>
    )
}