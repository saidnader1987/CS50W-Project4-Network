import View from "./View.js";
import postView from "./postView.js";
import editPostView from "./editPostView.js";

class PostsView extends View {
  _parentElement = document.querySelector(".posts__list");
  _errorMessage = "";
  _message = "";

  addHandlerRender(handler) {
    // On load upload posts
    window.addEventListener("load", function () {
      handler("all", 1);
    });
    // // When clicking all posts upload posts
    // const allPostsLink = document.querySelector("#all-posts");
    // allPostsLink.addEventListener("click", function (e) {
    //   e.preventDefault();
    //   handler();
    // });
  }

  addHandlerLike(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const likeBtn = e.target.closest(".like-button");
      if (!likeBtn) return;

      const likedPost = e.target.closest(".post");
      const id = likedPost.dataset.postId;
      // Like - Unlike
      handler(id);
    });
  }

  addHandlerProfile(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const profileLink = e.target.closest(".post__poster");
      if (!profileLink) return;

      const profile = profileLink.textContent;
      handler(profile, 1);
    });
  }

  addHandlerEdit(handler) {
    this._parentElement.addEventListener("click", function (e) {
      // If user is not logged in, do not prevent default of link when trying to like a post
      const likeLink = e.target.closest(".like-link");
      if (!likeLink) e.preventDefault();
      // Get the post related to the edit button that was click
      const editBtn = e.target.closest(".edit-link");
      if (!editBtn) return;
      // Getting the post to edit
      const post = e.target.closest(".post");
      const id = post.dataset.postId;
      const postContent = post.querySelector(".post__content");
      const content = postContent.textContent.trim();

      // Displaying modal and adding handler to submit button
      editPostView.showWindow(content, id);
      editPostView.addHandlerSubmit(handler);
    });
  }

  addHandlerSubmitEdit() {}

  _generateMarkUp() {
    return this._data.posts
      .map((post) =>
        postView.render({ userData: this._data.userData, ...post }, false)
      )
      .join("");
  }
}

export default new PostsView();
