import React from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react';
import AmplifyTheme from 'aws-amplify-react/dist/AmplifyTheme';

class App extends React.Component {
  state = {};

  render() {
    return <div>App</div>;
  }
}

const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: 'var(--amazonOrange)',
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: '5px',
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: 'var(--squidInk)'
  }
};

export default withAuthenticator(App, true, [], null, theme);
