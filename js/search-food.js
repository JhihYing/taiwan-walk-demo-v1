const catLocal = document.querySelector("a[data-catLocal]");
const catChinese = document.querySelector("a[data-catChinese]");
const catIce = document.querySelector("a[data-catIce]");
const catForeign = document.querySelector("a[data-catForeign]");
const catGift = document.querySelector("a[data-catGift]");
const catVegan = document.querySelector("a[data-catVegan]");

// 資料初始化
function init() {
  getFoodCategory();
}
init();

function getFoodCategory() {
  axios
    .get(
      `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24format=JSON`,
      {
        headers: getAuthorizationHeader(),
      }
    )
    .then(function (response) {
      const thisData = response.data[0];
      console.log(thisData);

      catLocal.setAttribute("href", "./search-food-result.html?class=catLocal");
      catChinese.setAttribute(
        "href",
        "./search-food-result.html?class=catChinese"
      );
      catIce.setAttribute("href", "./search-food-result.html?class=catIce");
      catForeign.setAttribute(
        "href",
        "./search-food-result.html?class=catForeign"
      );
      catGift.setAttribute("href", "./search-food-result.html?class=catGift");
      catVegan.setAttribute("href", "./search-food-result.html?class=catVegan");
    });
}

// TDX  API金鑰
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
