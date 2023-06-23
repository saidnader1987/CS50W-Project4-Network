import View from "./View.js";

class NavView extends View {
  _parentElement = document.querySelector(".navbar");
  _errorMessage = "";
  _message = "";

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      // Make sure a link was clicked
      const link = e.target.closest(".nav-item");
      if (!link) return;
      // These links will reload the page
      const exceptions = ["Log Out", "Register", "Log In"];
      const linkText = link.textContent.trim();
      // Prevent default except for links included in exceptions
      if (!exceptions.some((exception) => exception === linkText)) {
        e.preventDefault();
      }
      // Go to the respective page
      if (linkText === "All Posts") {
        handler("all", 1);
      } else if (linkText === "Following") {
        handler("following", 1);
      } else {
        // Profile page
        const profile = e.target.closest("#profile").textContent.trim();
        handler(profile, 1);
      }

      // const likedPost = e.target.closest(".post");
      // const id = likedPost.dataset.postId;
      // // Like - Unlike
      // handler(id);
    });
  }

  _generateMarkUp() {}
}

export default new NavView();
