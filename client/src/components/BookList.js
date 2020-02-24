import React, { Component } from 'react';
//npm install apollo-boost react-apollo graphql --save
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import BookDetails from './BookDetails';

const getBooksQuery = gql`
	{
		books {
			name
			id
			genre {
        id
        name
      }
			author {
				name
				age
				id
			}
		}
	}
`

class BookList extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		selected: null
  	}
  }
  displayBooks() {
  	var data = this.props.data;
  	if (data.loading) {
  		return (<div>Loading books</div>);
  	} else {
  		return data.books.map(book => {
        const genre = book.genre && book.genre.name ? book.genre.name : null;
  			return (
  			   <li key={book.id} onClick={ (e) => this.setState({ selected: book.id })}>{ book.name } - { genre } BY { book.author.name }</li>
  			)
  		});
  	}
  }
  render() {
    return (
      <div>
        <ul id="book-list">
        	{ this.displayBooks() }
        </ul>
        <BookDetails bookId={ this.state.selected }/>
      </div>
    );
  }
}
// binding tthe query to the BookList component
export default graphql(getBooksQuery)(BookList);
