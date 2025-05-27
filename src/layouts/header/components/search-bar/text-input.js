import styled from 'styled-components';


export const TextInput = styled.input`
    border: none;
    border-radius: ${props => props.theme.radius.round} 0 0 ${props => props.theme.radius.round};
    box-sizing: border-box;
    font-size: 14px;
    height: 48px;
    line-height: 48px;
    padding: ${props => props.theme.space.small} ${props => props.theme.space.large};
    width: 100%;
    background-color: ${props => props.theme.colors.grey[100]};
    color: black;

    &:focus {
        outline: none;
    }
`;