import React, { Component } from 'react';
import { addGenreMutation, getGenreQuery } from '../queries/queries';
import { graphql } from 'react-apollo';
import flowright from 'lodash.flowright';

class AddGenre extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      name: '',
	    };
	}
	submitForm(e) {
	    e.preventDefault();
	    console.log(this.state);
	    this.props.addGenreMutation({
	      variables: {
	        name: this.state.name,
	      }, 
	      refetchQueries: [{ query: getGenreQuery }]
	    });

	 }
	render() {
		return (
			<form id="add-genre" onSubmit={this.submitForm.bind(this)}>
				<div className="field">
		          <label>Genre name:</label>
		          <input type="text" onChange={ (e) => this.setState({name: e.target.value}) }/>
		        </div>
		        <button>+</button>
			</form>
		)
	}
}

export default flowright(
  graphql(addGenreMutation, { name: "addGenreMutation" }),
)(AddGenre);