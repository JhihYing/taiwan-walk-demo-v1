const touristResult = document.querySelector(".tourist-result");
const categoryContent = document.querySelector(".category");
const page = document.querySelector(".page");
const nonePage = document.querySelector(".nonePage");
const pagination = document.querySelector(".pagination");

// 選單 (jQuery)
$(document).ready(function () {
  // 選單 (全部縣市)
  $(".cityList").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("active");
    $(".cityDrowDown").slideToggle();
    $(".cityDrowDown").scrollTop(0); // 重新打開後滾輪回到最上面
  });

  // 選單 (全部縣市 - 下拉式點選)
  $(".cityDrowDown > li > a").click(function (e) {
    e.preventDefault();
    $(this).addClass("active");
    $(this).parent().siblings().find("a").removeClass("active");
  });

  // 選單 (全部主題)
  $(".themeList").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("active");
    $(".themeDrowDown").slideToggle();
    $(".themeDrowDown").scrollTop(0); // 重新打開後滾輪回到最上面
  });

  // 選單 (全部主題 - 下拉式點選)
  $(".themeDrowDown > li > a").click(function (e) {
    e.preventDefault();
    $(this).addClass("active");
    $(this).parent().siblings().find("a").removeClass("active");
  });
});

// 選單 (全部縣市 - 下拉式點選)
const cityList = document.querySelector(".cityList");
const cityName = document.querySelector(".cityList > a");

const cityDrowDown = document.querySelector(".cityDrowDown");

// 下面不能使用const,因為const不能賦予空值
let categolyEN;
let themeEN;

// const allCity = document.querySelector("a[data-allCity]");
// const allTheme = document.querySelector("a[data-allTheme]");
// let allCityEN = allCity.getAttribute("data-allCity");
// let allThemeEN = allTheme.getAttribute("data-allTheme");

cityDrowDown.addEventListener("click", function (e) {
  e.preventDefault();
  categolyEN = e.target.getAttribute("data-categoly");
  const categolyCN = e.target.innerHTML;
  console.log(categolyEN); // Taipei
  // console.log(categolyCN); // 臺北市
  cityName.innerText = categolyCN;
});

// 選單 (全部主題 - 下拉式點選)
const themeList = document.querySelector(".themeList");
const themeName = document.querySelector(".themeList > a");

const themeDrowDown = document.querySelector(".themeDrowDown");

themeDrowDown.addEventListener("click", function (e) {
  e.preventDefault();
  themeEN = e.target.getAttribute("data-theme");
  const themeCN = e.target.innerHTML;
  console.log(themeEN);
  // console.log(themeCN);
  themeName.innerText = themeCN;
});

// 關鍵字搜尋
const searchText = document.querySelector(".l-search-text");

// 搜尋按鈕
const send = document.querySelector(".searchBtn-m");

let thisData;

send.addEventListener("click", function (e) {
  const keyword = searchText.value;
  console.log(keyword);
  if (categolyEN == "allCity" && themeEN == "allTheme") {
    axios
      .get(
        `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=contains(ScenicSpotName%2C%20'${keyword}')&%24format=JSON`,
        {
          headers: getAuthorizationHeader(),
        }
      )
      .then(function (response) {
        console.log(response.data);
        // window.location.href="../search-tourism-result.html";
        thisData = response.data;
        categoryContent.style.display = "none";
        touristResult.style.display = "block";
        pages.style.display = "flex";

        // 初始取得資料渲染第一頁
        renderPage(1);
      });
  } else if (categolyEN == "allCity") {
    // contains(ScenicSpotName, '陽明山') and (Class1 eq '溫泉類' or Class2 eq '溫泉類' or Class3 eq '溫泉類')
    axios
      .get(
        `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=contains(ScenicSpotName%2C%20'${keyword}')%20and%20(Class1%20eq%20'${themeEN}'%20or%20Class2%20eq%20'${themeEN}'%20or%20Class3%20eq%20'${themeEN}')&%24format=JSON`,
        {
          headers: getAuthorizationHeader(),
        }
      )
      .then(function (response) {
        console.log(response.data);
        thisData = response.data;
        categoryContent.style.display = "none";
        touristResult.style.display = "block";
        pages.style.display = "flex";

        // 初始取得資料渲染第一頁
        renderPage(1);
        // window.location.href="../search-tourism-result.html"
      });
  } else if (themeEN == "allTheme") {
    axios
      .get(
        `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${categolyEN}?%24filter=contains(ScenicSpotName%2C%20'${keyword}')&%24format=JSON`,
        {
          headers: getAuthorizationHeader(),
        }
      )
      .then(function (response) {
        console.log(response.data);
        thisData = response.data;
        categoryContent.style.display = "none";
        touristResult.style.display = "block";
        pages.style.display = "flex";

        // 初始取得資料渲染第一頁
        renderPage(1);

        // window.location.href="../search-tourism-result.html"
      });
  } else {
    // contains(ScenicSpotName, '溫泉') and Class1 eq '溫泉類' or Class2 eq '溫泉類' or Class3 eq '溫泉類'
    // %2C代表逗號, %20代表空格
    axios
      .get(
        `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${categolyEN}?%24filter=contains(ScenicSpotName%2C%20'${keyword}')%20and%20(Class1%20eq%20'${themeEN}'%20or%20Class2%20eq%20'${themeEN}'%20or%20Class3%20eq%20'${themeEN}')&%24format=JSON`,
        {
          headers: getAuthorizationHeader(),
        }
      )
      .then(function (response) {
        // console.log(response.data);
        thisData = response.data;
        categoryContent.style.display = "none";
        touristResult.style.display = "block";
        pages.style.display = "flex";

        // 初始取得資料渲染第一頁
        renderPage(1);
      });
  }
});

const total = document.querySelector("span[data-total]"); // 總共幾筆資料
const jsList = document.querySelector("ul[data-jsList]"); // 旅遊景點資料
const pages = document.querySelector(".pages"); // (ul)整個頁碼區塊

const category = window.location.href.split("=")[1];
console.log(category);

let thisCategory = category;

// 2. 整體分頁功能 (一頁出現幾筆資料、計算頁碼要有多少)
function renderPage(nowPage) {
  let newArr = [];
  let totalPages;
  let currentData = []; // 取出當前頁數的資料 current:當前
  // console.log(currentData);

  thisData.forEach(function (item, index) {
    if (item.Picture.PictureUrl1 == undefined) {
      // console.log("找不到圖片");
      return;
    } else if (item.City == undefined) {
      // console.log("找不到位置");
      return;
    } else if (item.Picture.PictureDescription1 == undefined) {
      // console.log("alt是undefined");
      return;
    } else {
      newArr.push(item);
    }

    // 渲染總共幾筆資料
    total.textContent = newArr.length;

    let dataPerPage = 20; // 一頁 20 筆資料

    // Math.ceil():無條件進位到"較大"整數
    // console.log(Math.ceil(4.4));  // 5
    // console.log(Math.ceil(-4.4)); // -4
    // 所有資料的數量(長度) / 一頁幾筆資料
    // 不能使用thisData.length，因為這是沒有過濾過的全部景點
    totalPages = Math.ceil(newArr.length / dataPerPage); // 需要的頁數（無條件進位）

    let minData = dataPerPage * nowPage - dataPerPage + 1; //-1
    let maxData = dataPerPage * nowPage; // 20

    if (newArr.length >= minData && newArr.length <= maxData) {
      currentData.push(item);
    }
  });

  // 4. 頁數資訊
  let pageInfo = {
    totalPages, // 總頁數
    nowPage, // 當前頁數
    isFirst: nowPage == 1, // 是否為第一頁
    isLast: nowPage == totalPages, // 是否為最後一頁
  };
  console.log(pageInfo);

  // 呈現出該頁資料
  renderData(currentData);

  // 呈現分頁按鈕
  renderPageBtn(pageInfo);
}

// 3. 渲染景點資料
function renderData(Data) {
  let str = "";

  Data.forEach(function (item, index) {
    // console.log(item.ScenicSpotID);
    str += `
      <li>
        <a href="../tourism-page.html?id=${item.ScenicSpotID}">
          <div class="card-img">
            <img src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
          </div>
          <div class="card-text">
            <h3>${item.ScenicSpotName}</h3>
            <p>${item.City}</p>
          </div>
        </a>
      </li>
    `;
  });
  jsList.innerHTML = str;
}

// 5. 渲染分頁按鈕
function renderPageBtn(pageInfo) {
  let str = "";
  let totalPages = pageInfo.totalPages;

  // 是不是第一頁
  if (pageInfo.isFirst == true) {
    // 左邊箭頭(不能點選disabled)
    str += `
      <li class="page-item disabled">
        <a class="page-link arrow" href="#" aria-label="Previous" style="background-color: #E5E5E5; color: #65895F;">
          &laquo;
        </a>
      </li>
    `;
  } else {
    // 左邊箭頭(可以點選，並自訂data-page，因為它不是第一頁所以要 -1)
    // 要將頁碼轉換為 Number 型態
    str += `
      <li class="page-item">
        <a class="page-link arrow" href="#" aria-label="Previous" data-page="${
          Number(pageInfo.nowPage) - 1
        }">
          &laquo;
        </a>
      </li>
    `;
  }

  // 沒有資訊時
  if (totalPages == undefined) {
    pagination.style.display = "none";
    nonePage.style.display = "flex";
    nonePage.innerHTML = `
    <div class="nonePage-image"></div>
    <h4>目前查無資料<br>請重新搜尋</h4>`;
    total.textContent = 0;
  } else {
    nonePage.style.display = "none";
    pagination.style.display = "flex";
  }

  // 第1頁 ~ 最後一頁
  for (let i = 1; i <= totalPages; i++) {
    // 看頁數有幾頁就會跑幾次迴圈

    // 目前顯示的那頁加上 active
    if (Number(pageInfo.nowPage) == i) {
      str += `
        <li class="page-item" aria-current="page">
          <a class="page-link page-num active" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    } else {
      // 其他頁面 (不是目前的頁面)
      str += `
        <li class="page-item" aria-current="page">
          <a class="page-link page-num" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
  }

  // 是不是最後一頁
  // 右邊箭頭(不能點選disabled)
  if (pageInfo.isLast == true) {
    str += `
      <li class="page-item disabled">
        <a class="page-link arrow" href="#" aria-label="Next" style="background-color: #E5E5E5; color: #65895F;">
          &raquo;
        </a>
      </li>
    `;
  } else {
    // 右邊箭頭(可以點選，並自訂data-page，因為它不是最後一頁所以要 +1)
    str += `
      <li class="page-item">
        <a class="page-link arrow" href="#" aria-label="Next" data-page="${
          Number(pageInfo.nowPage) + 1
        }">
          &raquo;
        </a>
      </li>
    `;
  }

  pages.innerHTML = str;
}

// 點選按鈕切換頁面
pages.addEventListener("click", function (e) {
  e.preventDefault;
  // console.log('click!',e.target.nodeName);

  if (e.target.nodeName != "A") {
    return;
  }

  // dataset:透過 JS 的可以綁定 data-* 並取出中的值。
  let clickPage = e.target.dataset.page; // data-page是自訂的屬性
  // console.log(clickPage); // 可以取出該點擊的頁碼

  renderPage(clickPage);
});

function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = `${config.AppID}`;
  let AppKey = `${config.AppKey}`;
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString(); // 重新撈取新的時間
  let ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  let HMAC = ShaObj.getHMAC("B64"); // 使用HMAC的方式去壓縮
  let Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, "X-Date": GMTString };
}
