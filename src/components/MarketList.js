import React from 'react';
import { Loading, Card, Icon, Tag } from 'element-react';
import { Connect } from 'aws-amplify-react';
import { listMarkets } from '../graphql/queries';
import { onCreateMarket } from '../graphql/subscriptions';
import { graphqlOperation } from 'aws-amplify';
import Error from './Error';
import { Link } from 'react-router-dom';

const MarketList = ({ searchResults }) => {
  const onNewMarket = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery };
    const updatedMarketList = [
      newData.onCreateMarket,
      ...prevQuery.listMarkets.items,
    ];

    updatedQuery.listMarkets.items = updatedMarketList;

    console.log('here');

    return updatedQuery;
  };

  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
      {({ data, loading, errors }) => {
        if (errors.lengh > 0) return <Error errors={errors} />;
        if (loading || !data.listMarkets) return <Loading fullscreen={true} />;

        const markets =
          searchResults.length > 0 ? searchResults : data.listMarkets.items;

        return (
          <>
            {searchResults.length > 0 ? (
              <h2 className="text-green">
                <Icon type="success" name="check" className="icon" />
                {searchResults.length} Results
              </h2>
            ) : (
              <h2 className="header">
                <img
                  src="https://banner2.cleanpng.com/20171217/01f/shopping-cart-png-5a364b6d3217e8.4884266315135076932052.jpg"
                  alt="Store-Icon"
                  className="large-icon"
                />
                Markets
              </h2>
            )}

            {markets.map((market) => (
              <div key={market.id} className="my-2">
                <Card
                  bodyStyle={{
                    padding: '0.7em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span className="flex">
                      <Link className="link" to={`/markets/${market.id}`}>
                        {market.name}
                      </Link>

                      <span style={{ color: 'var(--darkAmazonOrange)' }}>
                        {market.products.length}
                      </span>

                      <img
                        src="https://img.icons8.com/2266EE/search"
                        alt="shopping card"
                      />
                    </span>

                    <div style={{ color: 'var(--lightSquidInk)' }}>
                      {market.owner}
                    </div>
                  </div>

                  <div>
                    {market.tags &&
                      market.tags.map((tag) => (
                        <Tag key={tag} type="danger" className="mx-1">
                          {tag}
                        </Tag>
                      ))}
                  </div>
                </Card>
              </div>
            ))}
          </>
        );
      }}
    </Connect>
  );
};

export default MarketList;
