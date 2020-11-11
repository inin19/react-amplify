import React from 'react';
import { Loading, Tabs, Icon } from 'element-react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import NewProduct from '../components/NewProduct';
import Product from '../components/Product';
import {
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
} from './../graphql/subscriptions';

export const getMarket = /* GraphQL */ `
  query GetMarket($id: ID!) {
    getMarket(id: $id) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          file {
            key
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      tags
      owner
      createdAt
      updatedAt
    }
  }
`;

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false,
  };

  componentDidMount() {
    this.handleGetMarket();

    // console.log(this.props.user);

    this.createProductListener = API.graphql(
      graphqlOperation(onCreateProduct, { owner: this.props.user.attributes.sub })
    ).subscribe({
      next: (productData) => {
        const createdProduct = productData.value.data.onCreateProduct;

        const prevProducts = this.state.market.products.items.filter(
          (item) => item.id !== createdProduct.id
        );

        const updatedProducts = [createdProduct, ...prevProducts];

        const market = { ...this.state.market };
        market.products.items = updatedProducts;
        this.setState({ market });
      },
    });

    this.updateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct, { owner: this.props.user.attributes.sub })
    ).subscribe({
      next: (productData) => {

        const updatedProduct = productData.value.data.onUpdateProduct;

        const updatedProductIndex = this.state.market.products.items.findIndex(
          (item) => item.id === updatedProduct.id
        );

        const updatedProducts = [
          ...this.state.market.products.items.slice(0, updatedProductIndex),
          updatedProduct,
          ...this.state.market.products.items.slice(updatedProductIndex + 1),
        ];

        const market = { ...this.state.market };
        market.products.items = updatedProducts;
        this.setState({ market });
      },
    });

    this.deleteProductListener = API.graphql(
      graphqlOperation(onDeleteProduct, { owner: this.props.user.attributes.sub })
    ).subscribe({
      next: (productData) => {
        const deletedProduct = productData.value.data.onDeleteProduct;
        const updatedProducts = this.state.market.products.items.filter(
          (item) => item.id !== deletedProduct.id
        );
        const market = { ...this.state.market };
        market.products.items = updatedProducts;
        this.setState({ market });
      },
    });
  }

  componentWillUnmount() {
    this.createProductListener.unsubscribe();
    this.updateProductListener.unsubscribe();
    this.deleteProductListener.unsubscribe();
  }

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId,
    };

    const result = await API.graphql(graphqlOperation(getMarket, input));

    this.setState({ market: result.data.getMarket, isLoading: false }, () => {
      this.checkMarketOwner();
    });
  };

  checkMarketOwner = () => {
    const { user } = this.props;
    const { market } = this.state;

    if (user) {
      this.setState({ isMarketOwner: user.username === market.owner });
    }
  };

  render() {
    const { market, isLoading, isMarketOwner } = this.state;

    return isLoading ? (
      <Loading fullscreen={true} />
    ) : (
      <>
        {/* Back button */}

        <Link className="link" to="/">
          Back to Markets List
        </Link>

        {/* market metadata */}
        <span className="items-center pt-2">
          <h2 className="mb-mr">{market.name}</h2>- {market.owner}
        </span>

        <div className="items-center pt-2">
          <span style={{ color: 'var(--lightSquiInk)', paddingBottom: '1em' }}>
            <Icon name="date" className="icon" />
            {market.createdAt}
          </span>
        </div>

        {/* New Product */}

        <Tabs type="border-card" value={isMarketOwner ? '1' : '2'}>
          {isMarketOwner && (
            <Tabs.Pane
              name="1"
              label={
                <>
                  <Icon name="plus" className="icon" />
                  Add Project
                </>
              }
            >
              <NewProduct marketId={this.props.marketId} />
            </Tabs.Pane>
          )}

          {/* Product list */}

          <Tabs.Pane
            label={
              <>
                <Icon name="menu" className="icon" />
                Products ({market.products.items.length})
              </>
            }
            name="2"
          >
            <div className="product-list">
              {market.products.items.map((product) => (
                <Product product={product} key={product.id} />
              ))}
            </div>
          </Tabs.Pane>
        </Tabs>
      </>
    );
  }
}

export default MarketPage;
