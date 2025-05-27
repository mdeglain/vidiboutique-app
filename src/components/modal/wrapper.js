import { styled } from "@mui/system"

export const Wrapper = styled('div')(({ theme, width }) => ({
    width: width,
    // padding: theme.space.xxl,
    height: "fit-content",
    maxHeight: "90vh",
    overflow: "scroll",
    borderRadius: theme.radius.medium,
    // margin: auto;
}));