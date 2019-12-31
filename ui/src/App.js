import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// components
import Main from './components/Main';

// style
import './App.css';

// const uri = process.env.NODE_ENV === 'production' ? 'https://fierce-ocean-63227.herokuapp.com/graphql' : 'http://localhost:4000/graphql'

// apollo client setup
const client = new ApolloClient({
    uri: 'https://fierce-ocean-63227.herokuapp.com/graphql'
});

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
            <Main/>
        </ApolloProvider>
    );
  }
}
export default App;