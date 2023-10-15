/**
 * If this file was used, it would look something like this:
 */
export default class ClientAPI {
	constructor() {
		// TODO: Initialize any API stuff
	}

	async getUserById(parent, args, context) {
		// TODO: Code to fetch user by id
	}

	async getPostById(parent, args, context) {
		// TODO: Code to fetch post by id
	}

	async getCommentById(parent, args, context) {
		// TODO: Code to fetch comment by id
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

	async getPostComments(parent, args, context) {
		// TODO: Code to fetch post's comments
	}

	async getUserPosts(parent, args, context) {
		// TODO: Code to fetch user's posts
	}

	async createPost(parent, { title, content, authorId }, context) {
		console.log(`Create post:`, title, content, authorId);
	}

	async updatePost(parent, { id, title, content }, context) {
		console.log(`Update post:`, id, title, content);
	}

	async deletePost(parent, { id }, context) {
		console.log(`Delete post:`, id);
	}
}
