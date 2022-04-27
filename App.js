import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from './auth/context'
import Main from './main'
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import NetworkError from './layouts/NetworkError'

export default function App(props) {

  const [showErrorScreen, setShowErrorScreen] = useState(false)

  const reset = () => {
    setShowErrorScreen(false)
  }

  const client = new ApolloClient({
    uri: 'http://beton-web.herokuapp.com/graphql',
    onError: ({ response, operation, graphQLErrors, networkError }) => {
      if (operation.operationName === "IgnoreErrorsQuery") {
        response.errors = null;
      }
      if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0].message) {
        console.log("Graphql error: ", graphQLErrors)
      }
      if (networkError) {
        setShowErrorScreen(true)
        console.log("Network error")
      } else {
        setShowErrorScreen(false)
      }
      if (response?.errors) {
        console.log("Response error")
      }

    }
  })

  return (
    <>
      {
        !showErrorScreen ?
          <ApolloProvider client={client}>
            <Main />
          </ApolloProvider> :
          <NetworkError reset={reset} />
      }
    </>
  );
}


