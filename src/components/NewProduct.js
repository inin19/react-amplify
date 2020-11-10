import React from 'react';
import { PhotoPicker } from 'aws-amplify-react';
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";
import { convertDollarsToCents } from './../utils';

import { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import { createProduct } from './../graphql/mutations';
import aws_exports from './../aws-exports';

const initialState = {
  description: '',
  price: '',
  shipped: false,
  imagePreview: '',
  image: '',
  isUploading: false,
};

class NewProduct extends React.Component {
  state = { ...initialState };

  componentDidMount() {
    console.log('debug');
    console.log(this.props.marketId);
  }

  handleAddProduct = async () => {
    try {
      this.setState({ isUploading: true });

      // const visibility = 'public';

      const { identityId } = await Auth.currentCredentials();
      const filename = `${identityId}/${Date.now()}-${this.state.image.name}`;

      const updatedFile = await Storage.put(filename, this.state.image.file, {
        contentType: this.state.image.type,
      });

      const file = {
        key: updatedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_user_files_s3_bucket_region,
      };

      const input = {
        productMarketId: this.props.marketId,
        description: this.state.description,
        shipped: this.state.shipped,
        price: convertDollarsToCents(this.state.price),
        file,
      };

      const result = await API.graphql(
        graphqlOperation(createProduct, { input })
      );

      console.log('created product', result);

      Notification({
        title: 'Success',
        message: 'Product succesfully created!',
        type: 'success',
      });

      this.setState({ ...initialState });
    } catch (err) {
      console.error('Error adding product');
    }
  };

  render() {
    const {
      description,
      price,
      image,
      shipped,
      imagePreview,
      isUploading,
    } = this.state;

    return (
      <div className="flex-center">
        <h2 className="header">Add New Product</h2>
        <div>
          <Form className="market-header">
            <Form.Item label="Add project Description">
              <Input
                type="text"
                icon="information"
                placeholder="Description"
                onChange={(description) => this.setState({ description })}
                value={description}
              />
            </Form.Item>

            <Form.Item label="Set Product Pricde">
              <Input
                type="number"
                icon="plus"
                placeholder="Price {$USD}"
                onChange={(price) => this.setState({ price })}
                value={price}
              />
            </Form.Item>

            <Form.Item label="Is the Project Shipped or Email to the customer?">
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

            {imagePreview && (
              <img
                className="image-preview"
                src={imagePreview}
                alt="Product Preview"
              />
            )}

            <PhotoPicker
              title="Product Image"
              preview="hidden"
              onLoad={(url) => this.setState({ imagePreview: url })}
              onPick={(file) => this.setState({ image: file })}
              theme={{
                formContainer: {
                  margin: 0,
                  padding: '0.8em',
                },
                formSection: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                sectionBody: {
                  margin: 0,
                  width: '250px',
                },
                sectionHeader: {
                  padding: '0.2em',
                  color: 'var(-darkAmazonOrange)',
                },
                photoPickerButton: {
                  display: 'none',
                },
              }}
            />

            <Form.Item>
              <Button
                disabled={!image || !description || !price || isUploading}
                type="primary"
                onClick={this.handleAddProduct}
                loading={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Add Project'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default NewProduct;
