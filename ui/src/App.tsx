/**
 * This is the top-level component that defines your UI application.
 *
 * This is an appropriate spot for application wide components and configuration,
 * stuff like application chrome (headers, footers, navigation, etc), routing
 * (what urls go where), etc.
 *
 * @see https://github.com/reactjs/react-router-tutorial/tree/master/lessons
 */

import * as React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Header, AI2Logo, AppTitle, Main, MaxWidthCenteredContent } from '@allenai/varnish/components';
import { Typography } from '@material-ui/core';

import Home from './pages/Home';
import About from './pages/About';
import { AppRoute } from './AppRoute';
import { Footer, ExternalLink } from './components';

/**
 * An array capturing the available routes in your application. You can
 * add or remove routes here.
 */
const ROUTES: AppRoute[] = [
    {
        path: '/',
        label: 'Home',
        component: Home
    },
    {
        path: '/about',
        label: 'About',
        component: About
    }
];

export default class App extends React.PureComponent {
    render() {
        return (
            <BrowserRouter>
                <Route path="/">
                    <React.Fragment>
                        <Header>
                            <AI2Logo />
                            <AppTitle>Skiff Template</AppTitle>
                        </Header>
                        <Main>
                            <Nav>
                                {ROUTES.map(({ path, label }) => (
                                    <NavLink key={path} to={path}>{label}</NavLink>
                                ))}
                            </Nav>
                            {ROUTES.map(({ path, component }) => (
                                <Route key={path} path={path} exact component={component} />
                            ))}
                        </Main>
                        <MaxWidthCenteredContent>
                            <Footer>
                                <Typography variant="caption">
                                    Proudly built at the
                                    {' '}<ExternalLink href="https://allenai.org">Allen Institute for Artificial Intelligence</ExternalLink>
                                </Typography>
                            </Footer>
                        </MaxWidthCenteredContent>
                    </React.Fragment>
                </Route>
            </BrowserRouter>
        );
    }
}

// TODO: Varnish should include canonical pattern for site navigation that
// allows us to remove all of this.
const Nav = styled.nav`
    margin: 0 0 ${props => props.theme.typography.pxToRem(props.theme.spacing.unit * 3)};
    padding: 0 0 ${props => props.theme.typography.pxToRem(props.theme.spacing.unit * 3)};
    border-bottom: 1px solid ${props => props.theme.palette.divider};
`

const NavLink = styled(Link)`
    font-family: ${props => props.theme.typography.subtitle1.fontFamily};
    font-size: ${props => props.theme.typography.subtitle1.fontSize};
    font-weight: 600;
    margin: 0 ${props => props.theme.typography.pxToRem(props.theme.spacing.unit * 3)};
    text-decoration: none;
    text-transform: uppercase;

    && {
        color: #45a9cd; /* TODO: This should be part of the Varnish theme. */

        &:hover {
            color: ${props => props.theme.palette.secondary.main}
        }
    }
`
