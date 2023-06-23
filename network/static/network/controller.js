import * as model from "./model.js";
import postsView from "./views/postsView.js";
import paginationView from "./views/paginationView.js";
import addPostView from "./views/addPostView.js";
import navView from "./views/navView.js";
import sectionTileView from "./views/sectionTileView.js";
import profileView from "./views/profileView.js";

const controlPosts = async function (
  query = model.state.posts.query,
  page = model.state.posts.page
) {
  try {
    // 1. Loading posts
    await model.loadPosts(query, page);
    // 2. Rendering the posts
    const postsData = {
      posts: model.state.posts.results,
      userData: model.state.user,
    };
    postsView.render(postsData);
    // 3. Render pagination buttons
    const paginationData = {
      page: model.state.posts.page,
      pages: model.state.posts.pages,
    };
    paginationView.render(paginationData);
    // 4. Render add view if logged in
    const addPostData = {
      logged: model.state.user.logged,
      query: model.state.posts.query,
    };
    addPostView.render(addPostData);
    // 5. Render section tile
    const sectionData = {
      query: model.state.posts.query,
    };
    sectionTileView.render(sectionData);
    // 6. Render profile
    if (
      model.state.posts.query !== "all" &&
      model.state.posts.query !== "following"
    ) {
      await controlProfile(query);
    }
    const profileData = {
      profile: model.state.profile,
      following: model.state.user.following,
      query: model.state.posts.query,
      loggedUser: model.state.user.username,
    };
    profileView.render(profileData);
  } catch (err) {
    console.error("💥💥💥💥", err);
  }
};

const controlAddPost = async function (newPost) {
  try {
    // 1. Add post
    await model.addPost(newPost);
    // 2. Rendering the posts: Go back to page 1 and render all posts
    await controlPosts("all", 1);
  } catch (err) {}
};

const controlPagination = async function (
  query = model.state.posts.query,
  goToPage
) {
  // 1. Loading posts for page and rendering data
  await controlPosts(query, goToPage);
};

const controlEditPost = async function (content, postId) {
  try {
    await model.editPost(content, postId);
    const data = {
      posts: model.state.posts.results,
      userData: model.state.user,
    };
    postsView.update(data);
  } catch (err) {}
};

const controlProfile = async function (username) {
  try {
    // 1. Loading profile
    await model.loadProfile(username);
  } catch (err) {}
};

const controlLikes = async function (postId) {
  try {
    await model.likePost(postId);
    // Update view with the new number of likes
    const data = {
      posts: model.state.posts.results,
      userData: model.state.user,
    };
    postsView.update(data);
  } catch (err) {}
};

const controlFollowers = async function (username) {
  try {
    await model.follow(username);
    // Update view with the new follow state and count
    const data = {
      profile: model.state.profile,
      following: model.state.user.following,
      query: model.state.posts.query,
      loggedUser: model.state.user.username,
    };
    profileView.update(data);
  } catch (err) {
    console.error("💥", err.message);
  }
};

// Subscribing to view events
const init = function () {
  postsView.addHandlerRender(controlPosts);
  postsView.addHandlerLike(controlLikes);
  postsView.addHandlerProfile(controlPosts);
  postsView.addHandlerEdit(controlEditPost);
  paginationView.addHandlerClick(controlPagination);
  addPostView.addHandlerPost(controlAddPost);
  navView.addHandlerClick(controlPosts);
  profileView.addHandlerFollow(controlFollowers);
};

init();
