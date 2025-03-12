// console.log("Hello World");
const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
};
const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
};

function loadCategories() {
  // fetch the data from web address. it will return the data in a Promise
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    //convert Promise into json
    .then((res) => res.json())

    //send the json data to display using displayCategories()
    .then((data) => displayCategories(data.categories));
}
function displayCategories(categories) {
  // get the container
  const categoryContainer = document.getElementById("category-container");

  // loop through the array of obj.
  for (let cat of categories) {
    // create Element
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
       <button id="btn-${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})" class="btn btn-sm hover:bg-red-600 hover:text-white">${cat.category}</button>
   `;

    //append the element
    categoryContainer.append(categoryDiv);
  }
}
loadCategories();

function loadVideos(searchText = "") {
  showLoader();
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((response) => response.json())
    .then((data) => {
      removeActiveClass();
      document.getElementById("btn-all").classList.add("active");
      displayVideos(data.videos);
    });
}

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");

  videoContainer.innerHTML = ``;

  if (videos.length == 0) {
    videoContainer.innerHTML = `
     <div
        class="col-span-full text-center flex flex-col justify-center items-center py-20"
      >
        <img class="w-[130px]" src="assets/img/Icon.png" alt="No videos" />

        <h2 class="text-2xl font-bold">
          Oops!! Sorry. There is no content here.
        </h2>
      </div>
    `;
  }

  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `

   <div class="card bg-base-100">
  <figure class="relative">
    <img class="w-full h-[150px] object-cover" src="${
      video.thumbnail
    }" alt="Shoes" />
    <span class="absolute bottom-2 right-2 text-white text-sm rounded bg-black px-2">3hrs 56mins ago</span>
  </figure>

  <!-- Flex container for the avatar and the intro -->
  <div class="flex gap-3 px-1 py-5 items-center">
    <div class="profile">
      <div class="avatar">
        <div class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2">
          <img src="${video.authors[0].profile_picture}" />
        </div>
      </div>
    </div>
    
    <!-- Intro section with title and other details -->
    <div class="intro">
      <h2 class="text-sm font-semibold">${video.title}</h2>
      <p class="text-sm text-gray-400 flex items-center gap-2">
        ${video.authors[0].profile_name}
        ${
          video.authors[0].verified == true
            ? `<img class="w-5 h-5" src="assets/img/verified.png" alt="verified logo" />
      `
            : ``
        }
       
       
        
        </p>
      <p class="text-sm text-gray-400">${video.others.views}</p>
    </div>
  </div>
  <button onClick="loadVideoDetails('${
    video.video_id
  }')" class="btn btn-block">Description</button>
</div>

  `;

    // append
    videoContainer.append(videoCard);
  });
  hideLoader();
};

// loadVideos();

const loadCategoryVideos = (id) => {
  showLoader();
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  // console.log(url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const clickedBtn = document.getElementById(`btn-${id}`);
      clickedBtn.classList.add("active");

      displayVideos(data.category);
    });
};

function removeActiveClass() {
  const activeBtns = document.getElementsByClassName("active");

  for (let btn of activeBtns) {
    btn.classList.remove("active");
  }
}

const loadVideoDetails = (videoId) => {
  // console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => displayVideoDetails(data.video));
};

const displayVideoDetails = (video) => {
  document.getElementById("video_details").showModal();
  const detailsContainer = document.getElementById("details-container");

  detailsContainer.innerHTML = `


  <div class="card bg-base-100 image-full w-96 shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
    <p>${video.description}</p>
   
  </div>
</div>
  `;
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  const input = e.target.value;
  loadVideos(input);
});
