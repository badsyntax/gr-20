import React, { Fragment } from 'react';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { Helmet } from 'react-helmet';
import { mergeStyles, PrimaryButton, Stack, Text } from '@fluentui/react';
import { BackgroundImage } from '../BackgroundImage/BackgroundImage';
import { GitHubRibbon } from '../GitHubRibbon/GitHubRibbon';
import cover from './cover.jpg';

const shadowStyles = {
  textShadow: '2px 2px 1px #000',
};

const leadTextClassName = mergeStyles(shadowStyles);
const headingClassName = mergeStyles(shadowStyles, {
  margin: 0,
});

const IndexPage: React.FunctionComponent = (props) => (
  <Fragment>
    <Helmet>
      <title>GR-20</title>
    </Helmet>
    <BackgroundImage imageUrl={cover} horizontalAlign="center">
      <GitHubRibbon />
      <Stack
        verticalAlign="center"
        styles={{
          root: {
            maxWidth: '42em',
            height: '100%',
            textAlign: 'center',
          },
        }}
        as="main"
        tokens={{
          childrenGap: 'm',
        }}
      >
        <Text block variant="superLarge" as="h1" className={headingClassName}>
          The GR 20
        </Text>
        <Text variant="xLarge" as="p" block className={leadTextClassName}>
          The GR 20 is a GR footpath that crosses the Mediterranean island of
          Corsica running approximately north-south, described by the outdoor
          writer Paddy Dillon as "one of the top trails in the world".
        </Text>
        <Text as="p" variant="xLarge" block>
          <PrimaryButton>View Routes</PrimaryButton>{' '}
          <PrimaryButton>View Kit</PrimaryButton>{' '}
          <PrimaryButton>About</PrimaryButton>
        </Text>
      </Stack>
    </BackgroundImage>
  </Fragment>
);
export default IndexPage;
