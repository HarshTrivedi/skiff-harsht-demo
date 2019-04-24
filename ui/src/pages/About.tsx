import * as React from 'react';
import styled from 'styled-components';

import { Paragraph, ExternalLink } from '../components';

export default class About extends React.PureComponent {
    render() {
        // TODO: Varnish should provide a component that makes writing multiline
        // text content easier. The necessity of the empty string prefix is
        // confusing and tedious.
        return (
            <React.Fragment>
                <Paragraph>
                    Ahoy!
                </Paragraph>
                <Paragraph>
                    This is a fresh application derived from the
                    {' '}<ExternalLink href="https://github.com/allenai/skiff-template">Skiff Template</ExternalLink>.
                    It provides a <ExternalLink href="https://www.python.org/">Python</ExternalLink>
                    {' '}based API and a UI constructed with
                    {' '}<ExternalLink href="https://www.typescriptlang.org/">TypeScript</ExternalLink>,
                    {' '}<ExternalLink href="https://reactjs.org/">ReactJS</ExternalLink>,
                    {' '}<ExternalLink href="https://github.com/allenai/varnish">Varnish</ExternalLink>,
                    and <ExternalLink href="https://material-ui.com/">Material UI</ExternalLink>.
                </Paragraph>
                <Paragraph>
                    It's deployed to a Google managed Kubernetes cluster and provides
                    DNS, log aggregation, TLS and other capabilties out of the box,
                    thanks to the
                    {' '}<ExternalLink href="https://github.com/allenai/skiff">Skiff</ExternalLink>
                    {' '}project.
                </Paragraph>
                <Paragraph>
                    If you have any questions, concerns or feedback please don't
                    hesitate to reach out. You can open a
                    {' '}<ExternalLink href="https://github.com/allenai/skiff-template/issues/new">Github Issue</ExternalLink>
                    {' '}or contact us at
                    {' '}<ExternalLink href="mailto:reviz@allenai.org">reviz@allenai.org</ExternalLink>.
                </Paragraph>
                <Paragraph>
                    Smooth sailing!
                </Paragraph>
                <Paragraph>
                    🌊⛵🌊️🌊
                </Paragraph>
            </React.Fragment>
        )
    }
}


