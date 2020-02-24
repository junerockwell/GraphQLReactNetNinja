import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getOneBookQuery, getAuthorsQuery, getGenreQuery } from '../queries/queries';
import flowright from 'lodash.flowright';

class BookDetails extends Component {
	constructor(props) {
	    super(props);
	  	this.state = {
	      name: '',
	      genreId: '',
	      authorId: '',
	    };

	 }
	componentWillUpdate() {
		const { book } = this.props.data;
		if (book) {
	    	console.log("book loaded");
			  	if (book.name) {
			  		console.log("book has name")
			  		this.setState({ name: book.name });
			  		console.log("lalal")
			  	}
			  	if (book.genre && book.genre.id) {
			  		this.setState({ genreId: book.genre.id });
			  	} 
			  	if (book.author && book.author.id) {
			  		this.setState({ authorId: book.author.id });
			  	}
			}
	}
	submitForm(e) {
		e.preventDefault();
		console.log(this.state);
	}
	displayAuthors() {
	    var data = this.props.getAuthorsQuery;
	    // console.log("xx", this.props);
	    
	    if (data.loading) {
	      return (<option disabled>Loading authors...</option>);
	    } else {
	      return data.authors.map(author => {
	        return (
	           <option key={author.id} value={author.id}>{ author.name }</option>
	        )
	      });
	    }
	  }
	displayGenre() {
	    var data = this.props.getGenreQuery;

	    if (data.loading) {
	      return (<option disabled>Loading genre...</option>);
	    } else {
	      return data.genre.map(g => {
	        return (
	          <option key={g.id} value={g.id}>{ g.name }</option>
	        )
	      });
	    }
	  }
	displayBookDetails() {
	  	const { book } = this.props.data;
	  	if (book) {
	  		let genreId = (book.genre && book.genre.id) || '';
	  		let authorId = (book.author && book.author.id) || '';
	  		
	  		return (
	  			// <div>
	  			// 	<h2>{ book.name }</h2>
	  			// 	<p>{ book.genre }</p>
	  			// 	<p>{ book.author.name }</p>
	  			// 	<p>All books by this author:</p>
	  			// 	<ul className="other-books">
	  			// 		{ book.author.books.map(item => {
	  			// 			return <li key={item.id}>{item.name}</li>
	  			// 		})}
	  			// 	</ul>
	  			// </div>
	  			<form id="update-book" onSubmit={this.submitForm.bind(this)}>
	  				<div className="field">
			          	<label>Book name:</label>
			          	<input type="text" value={this.state.name} onChange={ (e) => this.setState({name: e.target.value}) }/>
			        </div>

			        <div className="field">
		          		<label>Genre:</label>
		          		<select value={genreId} onChange={ (e) => this.setState({genreId: e.target.value}) }>
		            		<option>Select Genre</option>
		            		{ this.displayGenre() }
		          		</select>
		        	</div>

		        	<div className="field">
		          		<label>Author:</label>
		          		<select value={authorId} onChange={ (e) => this.setState({authorId: e.target.value}) }>
		            		<option>Select author</option>
		            		{ this.displayAuthors() }
		          		</select>
		        	</div>

		        	<button>Update</button>
	  			</form>
	  		)
	  	} else {
	  		return (
	  			<div>No book selected</div>
	  		)
	  	}
	}
	render() {
    	return (
    		<div id="book-details">
    		{ this.displayBookDetails() }
    		</div>
    	);
  	}
}

export default flowright(
	graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
	graphql(getGenreQuery, { name: "getGenreQuery" }),
	graphql(getOneBookQuery, {
		options: (props) => {
			return {
				variables: {
					id: props.bookId
				}
			}
		}
	})
)(BookDetails);

// export default graphql(getOneBookQuery, {
// 	options: (props) => {
// 		return {
// 			variables: {
// 				id: props.bookId
// 			}
// 		}
// 	}
// })(BookDetails);