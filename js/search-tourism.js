const catNature = document.querySelector("a[data-catNature]");
const catFactory = document.querySelector("a[data-catFactory]");
const catART = document.querySelector("a[data-catART]");
const catTemple = document.querySelector("a[data-catTemple]");
const catSports = document.querySelector("a[data-catSports]");
const catHotSpring = document.querySelector("a[data-catHotSpring]");
const catHistory = document.querySelector("a[data-catHistory]");
// const catOthers = document.querySelector("a[data-catOthers]");

// 資料初始化
function init() {
  getTourCategory();
}
init();

function getTourCategory() {
  axios
    .get(
      `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24format=JSON`,
      {
        headers: getAuthorizationHeader(),
      }
    )
    .then(function (response) {
      const thisData = response.data[0];
      console.log(thisData);

      catNature.setAttribute(
        "href",
        "./search-tourism-result.html?class=catNature"
      );
      catFactory.setAttribute(
        "href",
        "./search-tourism-result.html?class=catFactory"
      );
      catART.setAttribute("href", "./search-tourism-result.html?class=catART");
      catTemple.setAttribute(
        "href",
        "./search-tourism-result.html?class=catTemple"
      );
      catSports.setAttribute(
        "href",
        "./search-tourism-result.html?class=catSports"
      );
      catHotSpring.setAttribute(
        "href",
        "./search-tourism-result.html?class=catHotSpring"
      );
      catHistory.setAttribute(
        "href",
        "./search-tourism-result.html?class=catHistory"
      );
      // catOthers.setAttribute("href","./search-tourism-result.html?class=catOthers");
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
