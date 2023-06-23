import View from "./View.js";

class sectionTileView extends View {
  _parentElement = document.querySelector(".section-title");
  _errorMessage = "";
  _message = "";

  _generateMarkUp() {
    const { query } = this._data;
    let title;
    if (query === "all") title = "All Posts";
    else if (query === "following") title = "Following";
    else title = `${query}'s Profile`;
    return `<h1>${title}</h1>`;
  }
}

export default new sectionTileView();
