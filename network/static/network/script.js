"use strict";

// functions
const displayView = function (view) {
  //  show view and hide other views
  const viewToShow = document.querySelector(`.${view}-view`);
  const viewsToHide = document.querySelectorAll(
    `.body > div:not(.${view}-view)`
  );
  console.log(viewToShow);
  console.log(viewsToHide);
  // show view
  viewToShow.style.display = "block";
  //  hide views
  viewsToHide.forEach((view) => (view.style.display = "none"));
};

// by default load the all-posts view
displayView("all-posts");

// add event listeners to links
document.querySelector(".navbar").addEventListener("click", function (e) {
  // getting the nav link that was clicked
  const clicked = e.target.closest(".nav-link");
  // Matching strategy
  if (clicked) {
    const view = clicked.id;
    // Prevent reload of page for all links, except logout, login and register
    const nonReloadableViews = ["flollowing", "profile"];
    if (view) e.preventDefault();
    // render view
    console.log(view);
    displayView(view);
  }
});
