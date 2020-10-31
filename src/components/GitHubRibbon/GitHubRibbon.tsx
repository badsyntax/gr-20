import React from 'react';

export const GitHubRibbon: React.FunctionComponent = () => {
  return (
    <a href="https://github.com/badsyntax/gr-20">
      <img
        style={{ position: 'absolute', top: 0, left: 0 }}
        src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
        alt="Fork me on GitHub"
      />
    </a>
  );
};
