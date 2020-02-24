import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// import logo from './logo.svg';
// import './App.css';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import AddGenre from './components/AddGenre';

// apollo client setutp
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div id="main">
          <h1>Ninja's Reading List</h1>
          <AddBook />  
          <BookList />
          <AddGenre />
        </div>
      </ApolloProvider>
    );
  }
}
export default App;

// 1. Need to Add Genre - DONE
// 2. Need to Add New Author
// 3. Need to Edit Book (to update genreId)
