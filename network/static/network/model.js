import { AJAX } from "./helpers.js";

export const state = {
  user: {
    username: undefined,
    logged: false,
    likes: [],
    following: [],
  },
  profile: {
    username: "",
    following: "",
    followers: "",
  },
  posts: {
    page: 1,
    pages: "",
    query: "all",
    results: [],
  },
};

export const loadPosts = async function (
  query = state.posts.query,
  page = state.posts.page
) {
  try {
    state.posts.query = query;
    state.posts.page = page;
    const url = `/posts?q=${query}&page=${page}`;
    const data = await AJAX(url);
    // Update post list in state
    state.posts.results = data.posts;
    state.user.username = data.username ? data.username : undefined;
    state.user.logged = data.logged == "False" ? false : true;
    state.user.likes = data.user_likes;
    state.user.following = data.user_follows;
    state.posts.pages = data.pages;
  } catch (err) {
    console.error(`${err}💥💥💥💥💥`);
    throw err;
  }
};

export const loadProfile = async function (username) {
  try {
    const url = `/profile/${username}`;
    const data = await AJAX(url);
    state.profile.username = data.username;
    state.profile.following = data.following;
    state.profile.followers = data.followers;
  } catch (err) {
    console.error(`${err}💥💥💥💥💥`);
    throw err;
  }
};

export const addPost = async function (newPost) {
  try {
    const url = "/post";
    const data = await AJAX(url, { content: newPost }, "post");
  } catch (err) {
    console.error(`${err}💥💥💥💥💥`);
    throw err;
  }
};

export const editPost = async function (content, postId) {
  try {
    const url = `/edit`;
    const data = await AJAX(url, { id: postId, content: content }, "put");
    const { id, content: newContent } = data;
    const editedPost = state.posts.results.find((post) => post.id === +id);
    editedPost.content = newContent;
  } catch (err) {
    console.error(`${err}💥💥💥💥💥`);
    throw err;
  }
};

export const likePost = async function (postId) {
  try {
    const url = `/like`;
    const data = await AJAX(url, { id: postId }, "put");
    const { post_id: id, likes } = data;
    // Update post likes in state
    const post = state.posts.results.find((post) => post.id === id);
    post.likes = likes;
    // Update logged user's likes in state
    if (state.user.likes.some((liked_post) => liked_post === post.id)) {
      const index = state.user.likes.indexOf(post.id);
      state.user.likes.splice(index, 1);
    } else {
      state.user.likes.push(post.id);
    }
  } catch (err) {
    console.error(`${err}💥💥💥💥💥`);
    throw err;
  }
};

export const follow = async function (username) {
  try {
    const url = `/follow`;
    const data = await AJAX(url, { username: username });
    const { followers } = data;
    // Update followers in state
    state.profile.followers = followers;
    // Update logged user followings
    if (state.user.following.some((user) => user === username)) {
      const index = state.user.following.indexOf(username);
      state.user.following.splice(index, 1);
    } else {
      state.user.following.push(username);
    }
  } catch (err) {
    console.error(`${err.message}💥💥💥💥💥`);
    throw err;
  }
};
