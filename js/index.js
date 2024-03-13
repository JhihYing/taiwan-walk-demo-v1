// ---------------- 選單區域
// 選單 (jQuery)
$(document).ready(function () {
  // 選單 (全部主題)
  $(".themeList").click(function (e) {
    e.preventDefault();
    $(".themeDrowDown").slideToggle();
  });

  // 選單 (全部主題 - 下拉式點選)
  $(".themeDrowDown > li > a").click(function (e) {
    e.preventDefault();
    $(this).addClass("active");
    $(this).parent().siblings().find("a").removeClass("active");
  });
});

// 下面不能使用const,因為const不能賦予空值
let themeEN;

// 選單 (全部主題 - 下拉式點選)
const themeList = document.querySelector(".themeList");
const themeName = document.querySelector(".themeList > a");

const themeDrowDown = document.querySelector(".themeDrowDown");

themeDrowDown.addEventListener("click", function (e) {
  e.preventDefault();
  themeEN = e.target.getAttribute("data-theme");
  const themeCN = e.target.innerHTML;
  // console.log(theme);
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
  if (themeEN == "探索景點") {
    window.location.href = `../index-search-tourism-result.html?${keyword}`;
  } else if (themeEN == "節慶活動") {
    // contains(ActivityName, '溫泉')
    window.location.href = `../index-search-festival-result.html?${keyword}`;
  } else if (themeEN == "美味饗宴") {
    // contains(RestaurantName, '溫泉')
    window.location.href = `../index-search-food-result.html?${keyword}`;
  } else {
    alert("請選擇要搜尋的主題！");
    return;
  }
});

// 近期活動區域
const jsList = document.querySelector("ul[data-element]");
const thisTime = new Date(); // 現在的時間
// console.log(thisTime); // Sun Jan 23 2022 20:28:07 GMT+0800 (台北標準時間)

// 初始化-抓出所有活動
function init() {
  getFestivalList();
  getTouristList();
  getFoodList();
}
init();

function getFestivalList() {
  // 從最新的開始時間排序
  axios
    .get(
      "https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24orderby=StartTime%20desc&%24format=JSON",
      {
        headers: getAuthorizationHeader(),
      }
    )
    .then(function (response) {
      const thisData = response.data;
      let str = "";

      // 設置一個空陣列
      let newArr = [];

      thisData.forEach(function (item, index) {
        // console.log(item, index);

        const startTime = new Date(item.StartTime);
        const endTime = new Date(item.EndTime);

        let StartTime = new Date(item.StartTime).toLocaleDateString();
        let EndTime = new Date(item.EndTime).toLocaleDateString();

        if (item.Picture.PictureUrl1 == undefined) {
          // console.log("找不到圖片");
          return;
        } else {
          // 當圖片不是undefined時
          let imgName = item.Picture.PictureUrl1.split(".");
          let formatJpg = imgName[imgName.length - 1];

          // 驗證圖片是否為jpg格式
          if (formatJpg !== "jpg") {
            // console.log("圖片格式不是jpg");
            return;
          } else if (item.Picture.PictureDescription1 == undefined) {
            console.log("alt是undefined");
            return;
          }
          // 篩選活動時間是否進行中
          else if (checkEventTime(thisTime, startTime, endTime)) {
            // 把有符合時間的放進空陣列裡
            newArr.push(item);
            // console.log(newArr.length);

            if (newArr.length <= 4) {
              str += `
            <li>
              <a href="../festival-page.html?id=${item.ActivityID}">
                <div class="activity-img">
                  <img src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
                </div>
                <div class="activity-text">
                  <div class="text-top">
                    <p>${StartTime} - ${EndTime}</p>
                    <h3>${item.ActivityName}</h3>
                  </div>
                  <div class="text-button">
                    <p>${item.City}</p>
                    <p>詳細介紹</p>
                  </div>
                </div>
              </a>
            </li>`;
            }
          }
        }
      });
      jsList.innerHTML = str;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 篩選活動時間是否進行中
function checkEventTime(thisTime, startTime, endTime) {
  if (thisTime > startTime && thisTime < endTime) {
    return true; // true才會執行
  }
}

// 熱門打卡景點區域
const touristJsList = document.querySelector("ul[data-tourist]");

function getTouristList() {
  axios
    .get(
      "https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24format=JSON",
      {
        headers: getAuthorizationHeader(),
      }
    )
    .then(function (response) {
      console.log(response.data);

      // 搖亂thisDate陣列
      const thisDate = _.shuffle(response.data);

      let str = "";
      let newArr = [];

      thisDate.forEach(function (item) {
        if (item.Picture.PictureUrl1 == undefined) {
          // console.log("找不到圖片");
          return;
        } else if (item.City == undefined) {
          // console.log("找不到位置");
          return;
        } else if (item.Picture.PictureDescription1 == undefined) {
          console.log("alt是undefined");
          return;
        } else {
          newArr.push(item);
          if (newArr.length <= 4) {
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
          </li>`;
          }
        }
      });
      touristJsList.innerHTML = str;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 一再回訪美食區域
const foodJsList = document.querySelector("ul[data-food]");

function getFoodList() {
  axios
    .get(
      "https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24format=JSON",
      {
        headers: getAuthorizationHeader(),
      }
    )
    .then(function (response) {
      // 搖亂thisDate陣列
      const thisDate = _.shuffle(response.data);

      let str = "";
      let newArr = [];

      thisDate.forEach(function (item) {
        if (item.Picture.PictureUrl1 == undefined) {
          // console.log("找不到圖片");
          return;
        } else if (item.City == undefined) {
          // console.log("找不到位置");
          return;
        } else if (item.Picture.PictureDescription1 == undefined) {
          console.log("alt是undefined");
          return;
        } else {
          newArr.push(item);
          if (newArr.length <= 4) {
            str += `
          <li>
            <a href="../food-page.html?id=${item.RestaurantID}">
              <div class="card-img">
                <img src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
              </div>
              <div class="card-text">
                <h3>${item.RestaurantName}</h3>
                <p>${item.City}</p>
              </div>
            </a>
          </li>`;
          }
        }
      });
      foodJsList.innerHTML = str;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 下拉式選單
const touristList = document.querySelector("ul[data-tourist]");

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
