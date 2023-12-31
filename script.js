const imageWrapper = document.querySelector(".images");
const loadMore = document.querySelector(".load-more");
const searchBox = document.querySelector(".search-box input");
const lightBox = document.querySelector(".light-box");
const importbtn = lightBox.querySelector(".uil-import");
const Close = lightBox.querySelector(".uil-times");

// api , pagination, and searchContents
const apikey = "MGG0BRTnuEG2dngJWsT88XeecjH14QIGtSnJfYCl1wrfDVEzxVMuQNZH";
const perPage = 15;
let currentPage = 1;
let searchContent = null;

const downloadImage = (imgUrl) => {
    fetch(imgUrl).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(()=> alert("Failed to download image!"));
}

const showLightBox = (name,img) => {
    lightBox.classList.add("show");
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerHTML = name;
    document.body.style.overflow = "hidden";
    importbtn.setAttribute("data-img",img);
}

const hideLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card">
            <img src="${img.src.large2x}" onclick="showLightBox('${img.photographer}','${img.src.large2x}')" alt="">
            <div class="details">
                <div class="photograph">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button type="button" onclick="downloadImage('${img.src.large2x}')" class="import-btn">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

const getImages = (apiUrl) => {
    loadMore.innerHTML = "Loading...";
    loadMore.classList.add("disable");
    fetch(apiUrl, {
        headers: { Authorization: apikey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMore.innerHTML = "Load More"
        loadMore.classList.remove("disable");
    }).catch(() => alert("Failded to load images!"))
}

const loadMoreImages = () => {
    currentPage++;
    let apiurl;
    if(searchContent == null){
        console.log("if");
        apiurl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    }else{
        console.log("else");
        apiurl = `https://api.pexels.com/v1/search?query=${searchContent}&page=${currentPage}&per_page=${perPage}`;
    }
    getImages(apiurl);
}   

const loadSearchImages = (e) => {
    if(e.target.value == "") return searchContent = null;
    if(e.key === "Enter"){
        currentPage = 1;
        imageWrapper.innerHTML = "";
        searchContent = e.target.value;
        let apiurl = `https://api.pexels.com/v1/search?query=${searchContent}&page=${currentPage}&per_page=${perPage}`;
        getImages(apiurl);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMore.addEventListener("click", loadMoreImages);
Close.addEventListener("click", hideLightBox);
searchBox.addEventListener("keyup",loadSearchImages);
importbtn.addEventListener("click",(e) => downloadImage(e.target.dataset.img));
