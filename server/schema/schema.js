const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = graphql;


// dummy data
var books = [{
	name: 'Name of the Wind',
	genre: 'Fantasy',
	id: '1',
	authorId: '1'
}, {
	name: 'The Final Empire',
	genre: 'Fantasy',
	id: '2',
	authorId: '2'
}, {
	name: 'The Long Earth',
	genre: 'Sci-Fi',
	id: '3',
	authorId: '3'
}, {
	name: 'The Hero of Ages',
	genre: 'Fantasy',
	id: '4',
	authorId: '2'
}, {
	name: 'The Colour of Magic',
	genre: 'Fantasy',
	id: '5',
	authorId: '3'
}, {
	name: 'The Light Fantastic',
	genre: 'Fantasy',
	id: '6',
	authorId: '3'
}];

var authors = [{
	name: 'Patric Rothfuss', age: 44, id: '1',
}, {
	name: 'Brandon Sanderson', age: 42, id: '2',
}, {
	name: 'Terry Pratchett', age: 66, id: '3',
}];

var genre = [{
	id: '1',
	name: 'Fantasy'
}, {
	id: '2',
	name: 'Sci-Fi'
}, {
	id: '3',
	name: 'Horror'
}, {
	id: '4',
	name: 'Fiction'
}]

// defining data type
const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID }, // previously as GraphQLString
		name: { type: GraphQLString },
		// genre: { type: GraphQLString },

		// authorId: { type: GraphQLString }, // <---works but not needed so it's commented
		author: { 
			type: AuthorType,
			resolve(parent, args) {
				// `parents` is `var books`
				// console.log(parent);
				// return _.find(authors, { id: parent.authorId });

				return Author.findById(parent.authorId);
			},
		}, 
		genre: {
			type: GenreType,
			resolve(parent, args) {
				return Genre.findById(parent.genreId);
			}
		}
		// NOTE:
		// 1. How to, if there's more than 1 author 
		// 2. Do we have to add a field for each ObjectType (e.g. front cover artist, publisher, etc)
		// 3. What about books with more than 1 category?
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		name: { type: GraphQLString },
		id: { type: GraphQLID },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return _.filter(books, { authorId: parent.id })
				return Book.find({ authorId: parent.id });
			}
		},
		// - What about authors that wrote for more than 1 category?
		// - Authors that work/associated with more than 1 publisher?
	})
});

const GenreType = new GraphQLObjectType({
	name: 'Genre',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
	})
});

// defining root query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } }, // previously as GraphQLString
			resolve(parent, args) {
				// code to get data from db / other source
				// console.log(typeof(args.id));
				// return _.find(books, { id: args.id });
				return Book.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// console.log("id", args.id);
				// return _.find(authors, { id: args.id });

				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return books;
				return Book.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				// return authors;
				return Author.find({});
			}
		},
		genre: {
			type: new GraphQLList(GenreType),
			resolve(parent, args) {
				// return genre;
				return Genre.find({});
			}
		}
	}
});

// Add genreType
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name, // does this always match the args defined?
					age: args.age,
				});
				return author.save();
			},
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) }, // how to require an existing mongoid?
				genreId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					// genre: args.genre,
					authorId: args.authorId,
					genreId: args.genreId,
				});
				return book.save();
			}
		},
		updateBook: {
			type: BookType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: GraphQLID },
				genreId: { type: GraphQLID },
			},
			resolve(parent, args) {
				// console.log("updateBook", args);
				return Book.findById(args.id)
				.then(book => {
					// console.log("book: ", book);
					for (var key in args) {
						console.log("in loop:", key)
						if (book.toObject().hasOwnProperty(key)) {
							// console.log("yes")
						// 	console.log(key);
						// 	console.log(args[key])
							book[key] = args[key];
						}
					}
					return book.save();
				})
				.catch(err => {
					return err;
				});
			}
		},
		addGenre: {
			type: GenreType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let genre = new Genre({
					name: args.name,
					genreId: args.genreId,
				});
				return genre.save();
			}
		},
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
