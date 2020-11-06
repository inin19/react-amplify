import React from 'react';
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from './../graphql/mutations';

import { UserContext } from './../App';

class NewMarket extends React.Component {
  state = {
    addMarketDialog: false,
    name: '',
  };

  handleAddMarket = async (user) => {
    console.log(user);
    try {
      this.setState({ addMarketDialog: false });
      const input = {
        name: this.state.name,
        owner: user.username,
      };

      const result = await API.graphql(
        graphqlOperation(createMarket, { input })
      );

      console.info(`created market: ${result.data.createMarket.id}`);
      this.setState({ name: '' });
    } catch (err) {
      console.error('Error Adding new market', err);
      Notification.error({
        title: 'Error',
        message: `${err.message || 'Error Adding Market'}`,
      });
    }
  };

  render() {
    return (
      <UserContext.Consumer>
        {({ user }) => (
          <>
            <div className="market-header">
              <div className="market-title">
                Create Your market Place
                <Button
                  onClick={() => this.setState({ addMarketDialog: true })}
                  type="text"
                  icon="edit"
                  className="market-title-button"
                />
              </div>
            </div>

            <Dialog
              title="Create New Market"
              visible={this.state.addMarketDialog}
              onCancel={() => this.setState({ addMarketDialog: false })}
              size="large"
              customClass="dialog"
            >
              <Dialog.Body>
                <Form labelPosition="top">
                  <Form.Item label="Add Market Name">
                    <Input
                      placeholder="Market Name"
                      trim={true}
                      onChange={(name) => this.setState({ name })}
                      value={this.state.name}
                    />
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  onClick={() => this.setState({ addMarketDialog: false })}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  disabled={!this.state.name}
                  onClick={() => this.handleAddMarket(user)}
                >
                  Add
                </Button>
              </Dialog.Footer>
            </Dialog>
          </>
        )}
      </UserContext.Consumer>
    );
  }
}

export default NewMarket;
