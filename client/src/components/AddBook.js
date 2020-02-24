import React, { Component } from 'react';
//npm install apollo-boost react-apollo graphql --save
import { graphql } from 'react-apollo';
import { getAuthorsQuery, addBookMutation, getBooksQuery, getGenreQuery } from '../queries/queries';
import flowright from 'lodash.flowright';

class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      genre: '',
      authorId: '',
    };
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

  submitForm(e) {
    e.preventDefault();
    console.log(this.state);
    this.props.addBookMutation({
      variables: {
        name: this.state.name,
        // genre: this.state.genre,
        genreId: this.state.genreId,
        authorId: this.state.authorId,
      }, 
      refetchQueries: [{ query: getBooksQuery }]
    });

  }
  render() {
    return (
      <form id="add-book" onSubmit={this.submitForm.bind(this)}>
        <div className="field">
          <label>Book name:</label>
          <input type="text" onChange={ (e) => this.setState({name: e.target.value}) }/>
        </div>

        <div className="field">
          <label>Genre:</label>
          <select onChange={ (e) => this.setState({genreId: e.target.value}) }>
            <option>Select Genre</option>
            { this.displayGenre() }
          </select>
        </div>

        <div className="field">
          <label>Author:</label>
          <select onChange={ (e) => this.setState({authorId: e.target.value}) }>
            <option>Select author</option>
            { this.displayAuthors() }
          </select>
        </div>

        <button>+</button>
      </form>
    );
  }
}
/* <div className="field">
    <label>Genre:</label>
    <input type="text" onChange={ (e) => this.setState({genre: e.target.value}) }/>
  </div> */
export default flowright(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" }),
  graphql(getGenreQuery, { name: "getGenreQuery" }),
)(AddBook);
