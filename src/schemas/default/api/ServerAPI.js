import data from "@/schemas/default/api/testData";

export default class ServerAPI {
	constructor() {
		// TODO: Initialize any API stuff
	}

	async getUserById(parent, { id }, context) {
		return data.users.find((user) => user.id === Number(id));
	}

	async getPostById(parent, { id }, context) {
		return data.posts.find((post) => post.id === Number(id));
	}

	async getCommentById(parent, { id }, context) {
		return data.comments.find((comment) => comment.id === Number(id));
	}

	async getCommentPost(parent, args, context) {
		return this.getPostById(parent, args, context);
	}

	async getCommentAuthor(parent, args, context) {
		return this.getUserById(parent, args, context);
	}

	async getPostAuthor(parent, args, context) {
		return this.getUserById(parent, args, context);
	}

	async getPostComments(parent, { id }, context) {
		return data.comments.filter((comment) => comment.post === Number(id));
	}

	async getUserPosts(parent, { id }, context) {
		return data.posts.filter((post) => post.user === Number(id));
	}

	async createPost(parent, { title, content, authorId }, context) {
		console.log(`Create post:`, title, content, authorId);
		return {
			title,
			content,
			authorId,
		};
	}

	async updatePost(parent, { id, title, content }, context) {
		console.log(`Update post:`, id, title, content);
		return { id, title, content };
	}

	async deletePost(parent, { id }, context) {
		console.log(`Delete post:`, id);
		return { id };
	}
}
