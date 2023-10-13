const testData = {
	users: [
		{
			id: 1,
			name: "John Doe",
			email: "email1",
		},
		{
			id: 2,
			name: "Jane Doe",
			email: "email2",
		},
	],

	posts: [
		{
			id: 1,
			title: "My first post",
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			user: 1,
		},
		{
			id: 2,
			title: "My second post",
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			user: 1,
		},
		{
			id: 3,
			title: "My third post",
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			user: 2,
		},
	],

	comments: [
		{
			id: 1,
			text: "This is a comment.",
			user: 1,
			post: 1,
		},
		{
			id: 2,
			text: "This is another comment.",
			user: 2,
			post: 1,
		},
		{
			id: 3,
			text: "This is another comment.",
			user: 2,
			post: 2,
		},
	],
};
export default testData;
