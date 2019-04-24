/**
 * This file is meant for shared display components that you use throughout
 * your application.
 *
 * Components with a lot of logic, or those that are particularly complicated
 * should probably be put in their own file. This file is meant for the
 * re-usable, simple things used in a lot of different spots in your UI.
 */
import * as React from 'react';
import styled from 'styled-components';
import { Paper, Typography, CircularProgress, Grid } from '@material-ui/core';
import { ErrorOutlined } from '@material-ui/icons';

import { BodyText } from '@allenai/varnish/components';
import { Answer } from '../api';

export const Paragraph = styled(BodyText)`
    max-width: 600px;
    && {
        margin: 0 0 ${props => props.theme.typography.pxToRem(props.theme.spacing.unit * 2)};
    }
`;

export const PaddedPaper = styled(Paper)`
    padding: ${props => props.theme.typography.pxToRem(props.theme.spacing.unit * 3)};
`

export const AnswerInfo: React.SFC<{ answer: Answer }> = ({ answer }) => (
    <PaddedPaper>
        <Paragraph>Our system answered:</Paragraph>
        <Grid container spacing={8} alignItems="center">
            <Grid item>
                <Typography variant="h5">
                    “{answer.answer}”
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="caption">({answer.score} % confidence)</Typography>
            </Grid>
        </Grid>
    </PaddedPaper>
);

export const Loading = () => (
    <CircularProgress color="secondary" size={24} />
);

export const Error: React.SFC<{ message: string }> = ({ message }) => (
    <Grid container alignItems="center" spacing={8}>
        <Grid item><ErrorOutlined color="error" /></Grid>
        <Grid item>
            <Typography variant="body2" color="error">
                {message}
            </Typography>
        </Grid>
    </Grid>
);

export const ExternalLink = styled.a.attrs({
    'target': '_blank'
})`
    color: #45a9cd; /* TODO: This should be part of the Varnish theme. */

    &:hover {
        color: ${props => props.theme.palette.secondary.main}
    }
`;

export const Footer = styled.footer`
    padding: ${props => props.theme.typography.pxToRem(props.theme.spacing.unit * 2)};
    border-top: 1px solid ${props => props.theme.palette.divider};
`;
