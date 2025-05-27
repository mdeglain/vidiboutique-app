import { styled } from "@mui/material";

export const Wrapper = styled("div")(({ theme }) => ({
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "flex-end",
    width: "100%",
    flex: 2,

    "& > div": {
        margin: "0 10px",
    },
    "& > div:last-child": {
        paddingRight: "40px",
    },
}));
