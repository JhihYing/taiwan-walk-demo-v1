const id = window.location.href.split("=")[1];

const navCity = document.querySelector("a[data-navCity]");
navCity.style.cursor = "context-menu";
navCity.addEventListener("click", function (e) {
  e.preventDefault();
});

const navName = document.querySelector("a[data-navName]");
navName.style.cursor = "context-menu";
navName.addEventListener("click", function (e) {
  e.preventDefault();
});

const banner = document.querySelector("div[data-banner]");

const name = document.querySelector("h2[data-name]");
const class01 = document.querySelector("a[data-class01]");
class01.style.cursor = "context-menu";
class01.addEventListener("click", function (e) {
  e.preventDefault();
});

const class02 = document.querySelector("a[data-class02]");
class02.style.cursor = "context-menu";
class02.addEventListener("click", function (e) {
  e.preventDefault();
});

const descriptionDetail = document.querySelector("p[data-descriptionDetail]");

const open = document.querySelector("p[data-open]");
const phone = document.querySelector("p[data-phone]");
const organized = document.querySelector("p[data-organized]");
const address = document.querySelector("p[data-address]");
const websiteUrl = document.querySelector("a[data-websiteUrl]");
const ticket = document.querySelector("p[data-ticket]");
const remarks = document.querySelector("p[data-remarks]");

// 更多景點
const moreTitle = document.querySelector("a[data-moreTitle]");
const moreTourism = document.querySelector("ul[data-moreTourism]");

// 資料初始化
function init() {
  getfestivalPage();
}
init();

function getfestivalPage() {
  axios
    .get(
      `https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24filter=ActivityID%20eq%20'${id}'&%24format=JSON`,
      {
        headers: getAuthorizationHeader(),
      }
    )
    .then(function (response) {
      const thisData = response.data[0];
      console.log(thisData.City);

      // 城市中英轉換
      city = thisData.City;
      switch (city) {
        case "臺北市":
          city = "Taipei";
          console.log("city");
          break;
        case "新北市":
          city = "NewTaipei";
          console.log("city");
          break;
        case "桃園市":
          city = "Taoyuan";
          console.log("city");
          break;
        case "臺中市":
          city = "Taichung";
          console.log("city");
          break;
        case "臺南市":
          city = "Tainan";
          console.log("city");
          break;
        case "高雄市":
          city = "Kaohsiung";
          console.log("city");
          break;
        case "基隆市":
          city = "Keelung";
          console.log("city");
          break;
        case "新竹市":
          city = "Hsinchu";
          console.log("city");
          break;
        case "新竹縣":
          city = "HsinchuCounty";
          console.log("city");
          break;
        case "苗栗縣":
          city = "NMiaoliCounty";
          console.log("city");
          break;
        case "彰化縣":
          city = "ChanghuaCounty";
          console.log("city");
          break;
        case "南投縣":
          city = "NantouCounty";
          console.log("city");
          break;
        case "雲林縣":
          city = "unlinCounty";
          console.log("city");
          break;
        case "嘉義縣":
          city = "ChiayiCounty";
          console.log("city");
          break;
        case "嘉義市":
          city = "Chiayi";
          console.log("city");
          break;
        case "屏東縣":
          city = "PingtungCounty";
          console.log("city");
          break;
        case "宜蘭縣":
          city = "YilanCounty";
          console.log("city");
          break;
        case "花蓮縣":
          city = "HualienCounty";
          console.log("city");
          break;
        case "臺東縣":
          city = "TaitungCounty";
          console.log("city");
          break;
        case "金門縣":
          city = "KinmenCounty";
          console.log("city");
          break;
        case "澎湖縣":
          city = "PenghuCounty";
          console.log("city");
          break;
        case "連江縣":
          city = "LienchiangCounty";
          console.log("city");
          break;
      }

      navCity.textContent = thisData.City;
      navName.textContent = thisData.ActivityName;

      banner.style.backgroundImage = `url(${thisData.Picture.PictureUrl1})`;

      if (thisData.Class1 == undefined) {
        class01.style["display"] = "none";
        class02.style["display"] = "none";
      } else if (thisData.Class2 == undefined) {
        class01.textContent = thisData.Class1;

        class02.style["display"] = "none";
      } else {
        class01.textContent = thisData.Class1;
        class02.textContent = thisData.Class2;
      }

      let StartTime = new Date(thisData.StartTime).toLocaleDateString();
      let EndTime = new Date(thisData.EndTime).toLocaleDateString();

      descriptionDetail.textContent = thisData.Description;

      open.textContent = `${StartTime} - ${EndTime}`;

      phone.textContent = thisData.Phone;
      organized.textContent = thisData.Organizer;
      address.textContent = thisData.Address;
      websiteUrl.textContent = thisData.WebsiteUrl;
      websiteUrl.setAttribute("href", thisData.WebsiteUrl);
      ticket.textContent = thisData.Charge;
      remarks.textContent = thisData.Remarks;

      // Google Maps Embed API
      const iframe = document.querySelector("iframe");
      iframe.setAttribute(
        "src",
        `https://www.google.com/maps/embed/v1/place?key=${config.apiKey}&q=${thisData.Location}&zoom=17&center=${thisData.Position.PositionLat},${thisData.Position.PositionLon}`
      );

      // 附近景點
      const nearbyTourism = document.querySelector(".nearby-tourism");
      const nearbyFestival = document.querySelector(".nearby-festival");
      const nearbyFood = document.querySelector(".nearby-food");

      nearbyTourism.setAttribute(
        "href",
        `./nearby-tourism.html?theme=節慶活動=${thisData.ActivityID}`
      );
      nearbyFestival.setAttribute(
        "href",
        `./nearby-festival.html?theme=節慶活動=${thisData.ActivityID}`
      );
      nearbyFood.setAttribute(
        "href",
        `./nearby-food.html?theme=節慶活動=${thisData.ActivityID}`
      );

      moreTitle.textContent = `更多${thisData.City}活動`;
      getTourPageMore();
    });
}

// 更多景點

function getTourPageMore() {
  axios
    .get(
      `https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/${city}?%24format=JSON`,
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
        } else if (item.ActivityID == id) {
          console.log("同個景點");
          return;
        } else {
          newArr.push(item);
          if (newArr.length <= 4) {
            str += `
          <li>
            <a href="../festival-page.html?id=${item.ActivityID}">
              <div class="card-img">
                <img src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
              </div>
              <div class="card-text">
                <h3>${item.ActivityName}</h3>
                <p>${item.City}</p>
              </div>
            </a>
          </li>`;
          }
        }
      });
      moreTourism.innerHTML = str;
    })
    .catch(function (error) {
      console.log(error);
    });
}

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
