import React from 'react';
import './App.css';
import { AmplifyTheme, Authenticator } from 'aws-amplify-react';
import { Auth, Hub } from 'aws-amplify';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import Navbar from './components/Navbar';

class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    this.getUserData();

    Hub.listen('auth', this, 'onHubCapsule');
  }

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }) : this.setState({ user: null });
  };

  onHubCapsule = (capsule) => {
    switch (capsule.payload.event) {
      case 'signIn':
        console.log('sign in');
        this.getUserData();
        break;
      case 'signUp':
        console.log('sign up');
        break;
      case 'signOut':
        this.setState({ user: null });
        break;
      default:
        break;
    }
  };

  handleSignout = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error('Error signing out user', err);
    }
  };

  render() {
    const { user } = this.state;

    return !user ? (
      <Authenticator theme={theme} />
    ) : (
      <Router>
        <>
          <Navbar user={user} handleSignout={this.handleSignout} />

          <div className="app-container">
            <Route exact path="/" component={HomePage} />
            <Route path="/profile" component={ProfilePage} />
            <Route
              path="/markets/:marketId"
              component={({ match }) => (
                <MarketPage marketId={match.params.marketId} />
              )}
            />
          </div>
        </>
      </Router>
    );
  }
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: '#ffc0cb',
  },

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
    backgroundColor: 'var(--squidInk)',
  },
};

// export default withAuthenticator(App, true, [], null, theme);

export default App;
