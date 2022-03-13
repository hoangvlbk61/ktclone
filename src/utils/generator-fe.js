/** @format */

// Format: nosie + sorted

const randomStr = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getFullDate = () => {
  const d = Date.now();
  return (
    ("0" + d.getDate()).slice(-2) +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    d.getFullYear() +
    " " +
    ("0" + d.getHours()).slice(-2) +
    ":" +
    ("0" + d.getMinutes()).slice(-2)
  );
};

const getDateString = () => Date.now();

function getRandomInt(n) {
  return Math.floor(Math.random() * n);
}
function shuffle(arr) {
  const cloneArr = [...arr];
  var n = cloneArr.length;

  for (var i = 0; i < n - 1; ++i) {
    var j = getRandomInt(n);

    var temp = cloneArr[i];
    cloneArr[i] = cloneArr[j];
    cloneArr[j] = temp;
  }
  return cloneArr;
}

const generator = () => {
  const noise = randomStr(8);
  const joiner = "--";
  const dateStr = getDateString();
  const historyStr = history.length.toString();
  const origin = location.origin;

  const allKey = [
    dateStr,
    historyStr,
    origin,
    `${noise}${randomStr(8)}`,
    `${noise}${randomStr(8)}`,
    `${noise}${randomStr(8)}`,
    `${noise}${randomStr(8)}`,
  ];
  const shuffleKey = shuffle(allKey);
  const asciiKey = [noise, ...shuffleKey].join(joiner);
  return btoa(asciiKey);
};

const wrapperId = randomStr(16);
const timeId = randomStr(16);
const copyBtnId = randomStr(16);
let eleBtnCopy = null;
let eleWrapper = null;
let eleTime = null;

const addElement = () => {
  eleBtnCopy = document.createElement("button");
  eleWrapper = document.createElement("div");
  eleTime = document.createElement("div");
  eleBtnCopy.innerText = "Copy";
  eleWrapper.id = wrapperId;
  eleTime.id = timeId;
  eleBtnCopy.id = copyBtnId;
  document.getElementsByTagName("body")[0].appendChild(eleWrapper);
  const wrStyleObj = {
    background: "black",
    width: "100%",
    height: "50px",
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
  };
  const wrStyle = Object.keys(wrStyleObj)
    .map((attr) => `${attr}: ${wrStyleObj[attr]}`)
    .join("; ");
  eleWrapper.style = wrStyle;

  const txStyleObj = {
    color: "yellow",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
    "max-width": "calc(100vw - 350px)",
    "min-width": "150px",
  };
  const txStyle = Object.keys(txStyleObj)
    .map((attr) => `${attr}: ${txStyleObj[attr]}`)
    .join("; ");
  eleTime.style = txStyle;

  const btnStyleObj = {
    color: "yellow",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
    "max-width": "calc(100vw - 350px)",
    "min-width": "fit-content",
    "margin-top": "16px",
  };
  const btnStyle = Object.keys(btnStyleObj)
    .map((attr) => `${attr}: ${btnStyleObj[attr]}`)
    .join("; ");
  eleBtnCopy.style = btnStyle;
  eleBtnCopy.onclick = () => {
    const key = document.getElementById(timeId)["data-key"];
    navigator.clipboard.writeText(key);
  };
  eleWrapper.appendChild(eleTime);
};

const timeCount = () => {
  var distance = 60;
  var x = setInterval(() => {
    document.getElementById(timeId).innerHTML = `Còn ${distance} giây`;

    if (distance < 0) {
      clearInterval(x);
      const key = generator();
      document.getElementById(timeId).innerHTML = key;
      document.getElementById(timeId)["data-key"] = key;
      document.getElementById(wrapperId).appendChild(eleBtnCopy);
    }
    distance = distance - 1;
  }, 1000);
};

function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(() => {
  if (
    document.referrer &&
    typeof document.referrer === "string" &&
    document.referrer.includes("google")
  ) {
    addElement();
    timeCount();
  }
});
