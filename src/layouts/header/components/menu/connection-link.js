import styled from 'styled-components';

export const ConnectionLink = styled.div`
    cursor: pointer;
    &:hover {
        color: ${props => props.theme.colors.secondary};
    }
`;