import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".pagination__btn");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(undefined, goToPage);
    });
  }

  _generateMarkUp() {
    const { page: currPage, pages: numPages } = this._data;
    // Page 1 and there are other pages
    if (currPage === 1 && numPages > 1)
      return `
      <button data-goto="${
        currPage + 1
      }" class="pagination__btn pagination__btn--next">
        <span>&rarr;</span>      
        <span class="page-number">${currPage + 1}</span>      
      </button>
      `;

    // Page 1 and there are NO other pages
    if (currPage === 1 && numPages === 1) return "";

    // Page n and there are other pages
    if (currPage !== 1 && numPages > currPage)
      return `
        <button data-goto="${
          currPage - 1
        }" class="pagination__btn pagination__btn--prev">
      
          <span>&larr;</span>
          <span class="page-number">${currPage - 1}</span>
        </button>
        <button data-goto="${
          currPage + 1
        }" class="pagination__btn pagination__btn--next">
          <span>&rarr;</span>
          <span class="page-number">${currPage + 1}</span>
        </button>
        `;

    // Page n and there are NO otrher pages (LAST PAGE)
    if (currPage !== 1 && numPages === currPage)
      return `
      <button data-goto="${
        currPage - 1
      }" class="pagination__btn pagination__btn--prev">
        <span>&larr;</span>
        <span class="page-number">${currPage - 1}</span>
      </button>
      `;
  }
}

export default new PaginationView();
