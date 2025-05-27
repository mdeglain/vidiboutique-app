import React, { useContext } from "react"
import styled from "styled-components"

import { ThemeContext } from "@/contexts/theme-context"

import { SocialMediaButton } from "@/components/social-media-button/social-media-button"

import FacebookLogo from "@/assets/facebook-logo.svg"
import TwitterLogo from "@/assets/twitter-logo.svg"
import YoutubeLogo from "@/assets/youtube-logo.svg"
import LinkedinLogo from "@/assets/linkedin-logo.svg"
import VidiLogo from "@/assets/vidi-logo.png"

import { ClickableImage } from "@/components"


const Wrapper = styled.div`
    background-color: ${props => props.theme.colors.white};
    margin: 0 10%;
    padding-top: 3rem;
    padding-bottom: 1rem;
`

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
    ::after {
        display: block;
        content: "";
        position: absolute;
        left: 10px;
        bottom: 0;
        width: calc(100% - 20px);
        border-bottom: 1px solid ${props => props.theme.colors.grey[200]}
    }
`

const LeftSection = styled.div`
    flex: 6;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

const LeftSectionFollow = styled.div`
    margin-bottom: ${props => props.theme.space.large};
`

const Flex = styled.div`
    display: flex;

    &:first-child {
        margin-bottom: ${props => props.theme.space.xxl};
    }
`

const CookieText = styled.a`
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    cursor: pointer;
    margin: ${props => props.theme.space.xxl} 0;
    font-size: ${props => props.theme.fontSizes.m};
    font-weight: ${props => props.theme.fontWeights.light};

    &:hover {
        color: ${props => props.theme.colors.primary};
    }
`

const Section = styled.div`
    flex: 3;
    height: 100 %;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
`

const SectionTitle = styled.div`
    font-size: ${props => props.theme.fontSizes.s};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.primary};
    text-transform: uppercase;
    font-size: ${props => props.theme.fontSizes.m}
`

const Address = styled.p`
    color: ${props => props.theme.colors.primary};
    margin: ${props => props.theme.space.xl} 0;
    font-size: ${props => props.theme.fontSizes.m};
    font-weight: ${props => props.theme.fontWeights.light};
    
    & > a {
        cursor: pointer;
        text-decoration: none;
        font-size: ${props => props.theme.fontSizes.m};
        font-weight: ${props => props.theme.fontWeights.light};
        color: ${props => props.theme.colors.primary};
        &:hover {
            color: ${props => props.theme.colors.primary};
        }
    }

`


export const FooterMiddle = () => {
    const theme = useContext(ThemeContext);
    return (
        <Wrapper>
            <Row>
                <LeftSection>
                    <LeftSectionFollow>
                        <SectionTitle>SUIVEZ-NOUS</SectionTitle>
                        <Flex>
                            <SocialMediaButton link="https://www.facebook.com/groupevidi/" bgColor="rgb(59, 90, 154)" icon={FacebookLogo} alt="Facebook" customStyle={{ width: "12px", height: "12px", lineHeight: "12px" }} />
                            <SocialMediaButton link="https://twitter.com/Groupe_Vidi" bgColor="rgb(26, 169, 225)" icon={TwitterLogo} alt="Twitter" customStyle={{ width: "12px", height: "12px", lineHeight: "12px" }} />
                            <SocialMediaButton link="https://www.youtube.com/channel/UCNWP9-jgne05ileliBdde3g" bgColor="rgb(195, 25, 30)" icon={YoutubeLogo} alt="Youtube" customStyle={{ width: "12px", height: "12px", lineHeight: "12px" }} />
                            <SocialMediaButton link="https://www.linkedin.com/company/groupe-vidi/" bgColor="rgb(0, 115, 178)" icon={LinkedinLogo} alt="Linkedin" customStyle={{ width: "12px", height: "12px", lineHeight: "12px" }} />
                        </Flex>
                        <Flex>
                            <CookieText>Cookies et confidentialité</CookieText>
                        </Flex>
                    </LeftSectionFollow>
                </LeftSection>
                <Section>
                    <SectionTitle>Contact</SectionTitle>
                    <Address>
                        GROUPE VIDI<br />
                        183, avenue Charles de Gaulle<br />
                        92200 Neuilly-sur-Seine<br />
                        <a href="mailto:commandes@vidiboutique.fr">commandes@vidiboutique.fr</a>
                    </Address>
                </Section>
                <Section>
                    <SectionTitle>Groupe Vidi</SectionTitle>
                    <ClickableImage href="https://www.groupe-vidi.fr/" img={VidiLogo} alt={"Groupe Vidi"} customClassName={{ width: 90, marginTop: theme.space.xl }} />
                </Section>
            </Row>
        </Wrapper>
    )
}