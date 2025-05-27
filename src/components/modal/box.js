import { styled } from "@mui/system"

export const Box = styled('div')(({ theme, backgroundColor = 'white' }) => ({
    // width: '100%',
    padding: theme.space.xxl,
    backgroundColor: backgroundColor,
    position: 'relative',
    borderRadius: theme.radius.medium,
    overflow: 'auto',
}));
// export const Box = styled.div`
//     width: 100%;
//     padding: ${props => props.theme.space.xxl};
//     background-color: white;
//     position: relative;
//     border-radius: ${props => props.theme.radius.medium};
//     overflow: auto;
// `