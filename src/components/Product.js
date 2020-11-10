import React from 'react';
// prettier-ignore
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";
import { S3Image } from 'aws-amplify-react';
import { convertCentsToDollars } from './../utils';
import { UserContext } from '../App';
import PayButton from './PayButton';

class Product extends React.Component {
  state = {};

  render() {
    const { product } = this.props;

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
            </div>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

export default Product;
