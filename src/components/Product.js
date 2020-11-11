import React from 'react';
// prettier-ignore
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";
import { S3Image } from 'aws-amplify-react';
import { convertCentsToDollars, convertDollarsToCents } from './../utils';
import { UserContext } from '../App';
import PayButton from './PayButton';
import { updateProduct, deleteProduct } from './../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

class Product extends React.Component {
  state = {
    updateProductDialog: false,
    description: '',
    price: '',
    shipped: false,
    deleteProductDialog: false,
  };

  handleUpdateProduct = async (productId) => {
    try {
      this.setState({ updateProductDialog: false });
      const { description, price, shipped } = this.state;

      const input = {
        id: productId,
        description,
        shipped,
        price: convertDollarsToCents(price),
      };

      await API.graphql(graphqlOperation(updateProduct, { input }));

      Notification({
        title: 'Success',
        message: 'Product succesfully updated!',
        type: 'success',
      });
    } catch (err) {
      console.error(`failed to update profudct with id :${productId}`, err);
    }
  };

  handleDeleteProduct = async (productId) => {
    try {
      this.setState({ deleteProductDialog: false });

      const input = {
        id: productId,
      };

      await API.graphql(graphqlOperation(deleteProduct, { input }));

      Notification({
        title: 'Success',
        message: 'Product succesfully deleted!',
        type: 'success',
      });
    } catch (err) {
      console.error(`failed to delete profudct with id :${productId}`, err);
    }
  };

  render() {
    const { product } = this.props;
    const {
      updateProductDialog,
      description,
      shipped,
      price,
      deleteProductDialog,
    } = this.state;
    return (
      <UserContext.Consumer>
        {({ user }) => {
          const isProductOwner = user && user.attributes.sub === product.owner;

          return (
            <div className="card-container">
              <Card>
                <S3Image
                  imgKey={product.file.key}
                  theme={{
                    photoImg: { maxWidth: '100%', maxHeight: '100%' },
                  }}
                />

                <div className="card-body">
                  <h3 className="m-0">{product.description}</h3>
                  <div className="items-center">
                    <img
                      src="https://imageresource-yingying.s3.amazonaws.com/mail.png"
                      alt="mail"
                      height="15"
                    />
                    {product.shipped ? 'Shipped' : 'Emailed'}
                  </div>
                  <div className="text-right">
                    <span className="mx-1">
                      ${convertCentsToDollars(product.price)}
                    </span>

                    {!isProductOwner && <PayButton />}
                  </div>
                </div>
              </Card>

              {/* update / delete */}

              <div className="text-center">
                {isProductOwner && (
                  <>
                    <Button
                      type="warning"
                      icon="edit"
                      className="m-1"
                      onClick={() =>
                        this.setState({
                          updateProductDialog: true,
                          description: product.description,
                          shipped: product.shipped,
                          price: convertCentsToDollars(product.price),
                        })
                      }
                    />

                    <Popover
                      placement="top"
                      width="160"
                      trigger="click"
                      visible={deleteProductDialog}
                      content={
                        <>
                          <p>DO you want ot delete this</p>

                          <div className="text-right">
                            <Button
                              size="mini"
                              type="text"
                              className="m-1"
                              onClick={() =>
                                this.setState({ deleteProductDialog: false })
                              }
                            >
                              Cancel
                            </Button>
                            <Button
                              size="mini"
                              type="primary"
                              className="m-1"
                              onClick={() =>
                                this.handleDeleteProduct(product.id)
                              }
                            >
                              Confirm
                            </Button>
                          </div>
                        </>
                      }
                    >
                      <Button
                        onClick={() =>
                          this.setState({ deleteProductDialog: true })
                        }
                        type="danger"
                        icon="delete"
                      />
                    </Popover>
                  </>
                )}
              </div>

              {/* update product dialog */}
              <Dialog
                title="Update Product"
                size="large"
                customClass="dialog"
                visible={updateProductDialog}
                onCancel={() => this.setState({ updateProductDialog: false })}
              >
                <Dialog.Body>
                  <Form labelPosition="top">
                    <Form.Item label="Update project Description">
                      <Input
                        icon="information"
                        placeholder="Product Description"
                        trim={true}
                        onChange={(description) =>
                          this.setState({ description })
                        }
                        value={description}
                      />
                    </Form.Item>

                    <Form.Item label="Update Price">
                      <Input
                        type="number"
                        icon="plus"
                        placeholder="Price {$USD}"
                        onChange={(price) => this.setState({ price })}
                        value={price}
                      />
                    </Form.Item>

                    <Form.Item label="Update Shipping">
                      <div className="text-center">
                        <Radio
                          value="true"
                          checked={shipped === true}
                          onChange={() => this.setState({ shipped: true })}
                        >
                          Shipped
                        </Radio>
                        <Radio
                          value="false"
                          checked={shipped === false}
                          onChange={() => this.setState({ shipped: false })}
                        >
                          Emailed
                        </Radio>
                      </div>
                    </Form.Item>
                  </Form>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    onClick={() =>
                      this.setState({ updateProductDialog: false })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => this.handleUpdateProduct(product.id)}
                  >
                    Update
                  </Button>
                </Dialog.Footer>
              </Dialog>
            </div>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

export default Product;
