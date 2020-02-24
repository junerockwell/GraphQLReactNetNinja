import { gql } from 'apollo-boost';

const getBooksQuery = gql`
	{
		books {
			name
			id
			genre
			author {
				name
				age
				id
			}
		}
	}
`

const getOneBookQuery = gql`
	query($id: ID) {
		book(id: $id) {
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
				books {
					name
					id
				}
			}
		}
	}
`

const getAuthorsQuery = gql`
  {
    authors {
      name
      id
      age
    }
  }
`

const addBookMutation = gql`
   	mutation($name: String!, $genreId: ID!, $authorId: ID!) {
   		addBook(name: $name, genreId: $genreId, authorId: $authorId) {
   			name
   			genre
   			id
   			author {
   				name
   				age
   				id
   			}
   		}
   	}
`

const updateBookMutation = gql`
	mutation($name: String, $genreId: ID, $authorId: ID) {
		updateBook(name: $name, genreId: $genreId, authorId: $authorId) {
			name
   			genre
   			id
   			author {
   				name
   				age
   				id
   			}
		}
	}
`

const addGenreMutation = gql`
   	mutation($name: String!) {
   		addGenre(name: $name) {
   			name
   			id
   		}
   	}
`

const getGenreQuery = gql`
	{
		genre {
			name
			id
		}
	}
`

export { 
	getBooksQuery, 
	getAuthorsQuery, 
	addBookMutation, 
	getOneBookQuery, 
	getGenreQuery, 
	addGenreMutation,
	updateBookMutation
}


