import View from "./View.js";

class EditPostView extends View {
  _parentElement = document.querySelector(".edit");
  _message = "Post was successfully edited";

  _window = document.querySelector(".edit-post-window");
  _overlay = document.querySelector(".overlay");
  _textArea = document.querySelector(".edit__input");
  _id = "";
  _btnOpen = "";
  _btnClose = document.querySelector(".btn--close-modal");

  constructor(btn) {
    super(); // We need to call the super function in order to be able to use the this keyword in the next line.
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  showWindow(content, id) {
    this._textArea.value = content;
    this._id = id;
    this._toggleWindow();
  }

  _addHandlerHideWindow() {
    // this._btnClose.addEventListener("click", this._toggleWindow.bind(this));
    // this._overlay.addEventListener("click", this._toggleWindow.bind(this));
    const viewObj = this;
    this._btnClose.addEventListener("click", function (e) {
      viewObj._removeHandlerSubmit();
      viewObj._toggleWindow();
    });
    this._overlay.addEventListener("click", function (e) {
      viewObj._removeHandlerSubmit();
      viewObj._toggleWindow();
    });
  }

  _removeHandlerSubmit() {
    // Remove all 'submit' event listeners from the form element
    this._parentElement.replaceWith(this._parentElement.cloneNode(true));
    // The form element in the DOM changed so we need to select the form elements again
    this._parentElement = document.querySelector(".edit");
    this._textArea = document.querySelector(".edit__input");
  }

  addHandlerSubmit(handler) {
    const viewObj = this;
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const content = Object.fromEntries(dataArray).content;
      if (!content) return;
      handler(content, viewObj._id);
      viewObj._removeHandlerSubmit();
      viewObj._toggleWindow();
    });
  }

  _generateMarkUp() {}
}

export default new EditPostView();
