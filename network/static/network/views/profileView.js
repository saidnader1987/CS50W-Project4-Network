import View from "./View.js";

class ProfileView extends View {
  _parentElement = document.querySelector(".profile");
  _errorMessage = "";
  _message = "";

  addHandlerFollow(handler) {
    const viewObj = this;
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      const followBtn = e.target.closest(".follow-btn");
      if (!followBtn) return;
      const userToFollow = viewObj._parentElement
        .querySelector(".profile-name")
        .textContent.trim();
      handler(userToFollow);
    });
  }

  _generateMarkUp() {
    const { username, followers, following } = this._data.profile;
    const { query, loggedUser } = this._data;
    const follow = this._data.following.some((user) => user === username);

    return query !== "all" && query !== "following"
      ? `
      <div class="profile-container">
        <div class="profile-header">
          <h1 class="profile-name">${username}</h1>
          ${
            loggedUser !== username && loggedUser !== undefined
              ? `<button class="follow-btn ${
                  follow ? "unfollow" : ""
                } btn btn-primary">${follow ? "Unfollow" : "Follow"}</button>`
              : ""
          }
        </div>
        <div class="profile-counts"> 
          <div class="followers">
            <div>
              <span>&rarr;</span>  
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon count-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p class="label">Followers ${followers}</p>
          </div>
          <div class="following">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon count-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>&rarr;</span>   
            </div>
            <div>
              <p class="label">Following ${following}</p>
            </div>
          </div>
        </div>
      </div>
    `
      : "";
  }
}

export default new ProfileView();
