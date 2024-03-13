const catFestuval = document.querySelector("a[data-catFestuval]");
// const catYears = document.querySelector("a[data-catYears]");
const catArt = document.querySelector("a[data-catArt]");

// 資料初始化
function init() {
  getActivityCategory();
}
init();

function getActivityCategory() {
  axios
    .get(
      `https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24format=JSON`,
      {
        headers: getAuthorizationHeader(),
      }
    )
    .then(function (response) {
      const thisData = response.data[0];
      console.log(thisData);

      catFestuval.setAttribute(
        "href",
        "./search-festival-result.html?class=catFestuval"
      );
      // catYears.setAttribute("href","./search-festival-result.html?class=catYears");
      catArt.setAttribute("href", "./search-festival-result.html?class=catArt");
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
