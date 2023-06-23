import View from "./View.js";

class AddPostView extends View {
  _parentElement = document.querySelector(".add-post");
  _errorMessage = "";
  _message = "";

  addHandlerPost(handler) {
    const viewObj = this;
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      const submitBtn = e.target.closest(".post-form__submit");
      if (!submitBtn) return;
      const textArea =
        viewObj._parentElement.querySelector(".post-form__input");
      const content = textArea.value;
      if (!content) return;
      handler(content);
    });
  }

  _generateMarkUp() {
    const { query, logged } = this._data;
    return logged && query === "all"
      ? `<form class="post-form">
          <label for="content">New Post</label>
          <textarea
            id="content"
            name="content"
            class="post-form__input form-control mb-3"
            rows="4"
          ></textarea>
          <button class="post-form__submit btn btn-primary" type="submit">
            Post
          </button>
        </form>`
      : "";
  }
}

export default new AddPostView();
