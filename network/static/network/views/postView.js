import View from "./View.js";

class PostView extends View {
  _parentElement = "";

  _formatPostDate(date) {
    const dateObj = new Date(date);
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
    const daysPassed = calcDaysPassed(new Date(), dateObj);
    if (daysPassed === 0) return "Posted today";
    if (daysPassed === 1) return "Posted yesterday";
    if (daysPassed <= 7) return `Posted ${daysPassed} days ago`;

    const day = `${dateObj.getDate()}`.padStart(2, 0);
    const month = `${dateObj.getMonth() + 1}`.padStart(2, 0);
    const year = dateObj.getFullYear();
    return `Posted on ${day}/${month}/${year}`;
  }

  _generateMarkUp() {
    const formatedDate = this._formatPostDate(this._data.timestamp);
    const btnClass = this._data.userData.likes.some(
      (liked_post) => liked_post === this._data.id
    )
      ? "like-button like-button--liked"
      : "like-button";
    return `
      <div class="post" data-post-id=${this._data.id}>
        <d class="post__header">
          <a href='#' class="post__poster">${this._data.poster}</a>
          ${
            this._data.userData.username === this._data.poster
              ? '<a href="#" class="edit-link">Edit</a>'
              : ""
          }
        </d>
        <div class="post__content">
          <p>${this._data.content}</p>
        </div>
        <div class="post__footer">
          <span class="post__date">${formatedDate}</span>
          ${
            this._data.userData.username != undefined
              ? `<button class="${btnClass}"
                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon heart-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg></button>`
              : '<a class="like-link" href=/login><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"     stroke-width="1.5" stroke="currentColor" class="icon heart-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg></a>'
          }
          <span class="post__likes">${this._data.likes}</span>
        </div>
      </div>
    `;
  }
}

export default new PostView();
