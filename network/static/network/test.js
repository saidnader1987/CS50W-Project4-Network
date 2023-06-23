const funcPro = async function () {
  await Promise.resolve("Resolved promise");
  for (let i = 0; i < 10000000000; i++) {}
  console.log("res");
};

// 1. sinchronous code
console.log("test start");
// 2. load event
window.addEventListener("load", function () {
  console.log("event");
});
// // 3. Microtask (Promise) immediately resolved.
// funcPro();

// 3.1 Microtask (Promise) not immediately resolved
const url = "https://forkify-api.herokuapp.com/api/v2/recipes/";
fetch(url).then((res) => console.log(res));
// 4. Sinchronous code
console.log("test end");
