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
    tags: ['Arts', 'Web Dev', 'Technology', 'Craft', 'Entertainment'],
    selectedTags: [],
    options: [],
  };

  handleFilterTags = (query) => {
    const options = this.state.tags
      .map((tag) => ({ value: tag, label: tag }))
      .filter((tag) =>
        tag.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      );

    this.setState({ options });
  };

  handleAddMarket = async (user) => {
    console.log(user);
    try {
      this.setState({ addMarketDialog: false });
      const input = {
        name: this.state.name,
        owner: user.username,
        tags: this.state.selectedTags,
      };

      const result = await API.graphql(
        graphqlOperation(createMarket, { input })
      );

      console.info(`created market: ${result.data.createMarket.id}`);
      this.setState({ name: '', selectedTags: [] });
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
              <h1 className="market-title">
                Create Your market Place
                <Button
                  onClick={() => this.setState({ addMarketDialog: true })}
                  type="text"
                  icon="edit"
                  className="market-title-button"
                />
              </h1>

              <Form inline={true} onSubmit={this.props.handleSearch}>
                <Form.Item>
                  <Input
                    value={this.props.searchTerm}
                    placeholder="Search Markets..."
                    icon="circle-cross"
                    onIconClick={this.props.handleClearSearch}
                    onChange={this.props.handleSearchChange}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="info"
                    icon="search"
                    onClick={this.props.handleSearch}
                    loading={this.props.isSearching}
                  >
                    Search
                  </Button>
                </Form.Item>
              </Form>
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

                  <Form.Item label="Add tags">
                    <Select
                      multiple={true}
                      filterable={true}
                      placeholder="Market Tags"
                      onChange={(selectedTags) =>
                        this.setState({ selectedTags })
                      }
                      remoteMethod={this.handleFilterTags}
                      remote={true}
                    >
                      {this.state.options.map((option) => (
                        <Select.Option
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Select>
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
