import React from 'react';
import Navigation from './src/navigation/Navigation';
import {ApolloProvider} from '@apollo/client';
import {client} from './src/graphQL/client';
import 'react-native-gesture-handler';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Navigation />
    </ApolloProvider>
  );
};

export default gestureHandlerRootHOC(App);
