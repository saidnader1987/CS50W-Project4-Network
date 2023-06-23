export default class View {
  _data;

  render(data, render = true) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    if (!data) return this.renderError();
    this._data = data;
    const markup = this._generateMarkUp();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    // Generate the new markup but do not render it
    this._data = data;
    const newMarkup = this._generateMarkUp();
    // Create a virtual DOM in memory from the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Select all elements from the newly created DOM
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    // Select all elements from the actual DOM displayed on the page
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    // Compare each node one by one and changing the inner html of the node that changed
    newElements.forEach((newEl, i) => {
      // Same index because we are not inserting elements, just updating existing ones
      const curEl = curElements[i];
      if (!newEl.isEqualNode(curEl)) {
        curEl.innerHTML = newEl.innerHTML;
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <p>${message}</p>
        </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
          <p>${message}</p>
        </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
