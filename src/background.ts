import axios from "axios";
let seconds: any;
let url: string = "";

//setting initial storage
chrome.storage.local.set({ active: true });

//fxn to handle idle state
const handleIdleState = () => {
  chrome.idle.queryState(40, function (state) {
    if (state === "active") {
      chrome.storage.local.set({ active: true });
    } else {
      chrome.storage.local.set({ active: false });
    }
  });
};

let blockedUrls = ["https://www.facebook.com/"];

//fxn to update the local storage
//logic:-->
// if already in local storage take that and add into that
//otherwise add in local storage

const handleLocalStorage = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    let activeUrl = tab.url || "";
    console.log("audible", tab.audible);
    let isAudible = tab.audible;
    // let isMuted=tab.mutedInfo?.muted;
    // let AudioMuted=(isAudible && isMuted)

    handleIdleState();

    chrome.tabs.sendMessage(tabs[0].id || 0, { action: "Stopped" }); //msg to content script for changing tabs

    //if the present tab is audible,it will still be in the active state
    if (isAudible) {
      chrome.storage.local.set({ active: true });
    }

    //if the url in blocked urls
    if (blockedUrls.includes(activeUrl)) {
      chrome.tabs.sendMessage(tabs[0].id || 0, { action: "Blocked" }); //send message to content script
    }

    // tabs which are not actual websites should not be saved in local storage
    if (activeUrl.split("/")[0] !== "https:") {
      return;
    }

    activeUrl = activeUrl.split("/")[2];

    //first see if the if the document is not hidden and not in idle state
    chrome.storage.local.get(["stop", "active"], function (data) {
      //console.log("active",data.active,!data.stop)
      if (!data.stop && data.active) {
        if (activeUrl) {
          chrome.storage.local.get(activeUrl, (res) => {
            console.log("response", res);
            if (res[activeUrl] !== undefined) {
              seconds = res[activeUrl];
              chrome.storage.local.set({ [activeUrl]: seconds + 1 });
              chrome.runtime.sendMessage({ seconds, activeUrl });
            } else {
              seconds = 0;
              chrome.storage.local.set({ [activeUrl]: 0 });
              chrome.runtime.sendMessage({ seconds, activeUrl });
            }
          });
        }
      }
    });
  });
};
//running locastorage fxn on 1 sec
setInterval(handleLocalStorage, 1000);

const apiCall1 = async (labels: any, datum: any, mail: any) => {
  try {
    const response = await axios.post("http://localhost:5000/send", {
      labels: labels,
      datum: datum,
      message: "",
      mail: mail,
    });
    if (response.status === 200) {
      alert("email sent");
    }
  } catch (err) {
    console.log(err);
  }
};

const apiCall = async (labels: any, datum: any) => {
  chrome.storage.local.get("mail", function (data) {
    if (data.mail !== undefined) {
      alert("I am here");
      apiCall1(labels, datum, data.mail);
    }
  });
};

//after 10 seconds send to popup to re-render the chart
setInterval(() => {
  var allKeys;
  var allValues;
  chrome.storage.local.get(null, function (items) {
    let { stop, active, mail, ...newItems } = items;
    allKeys = Object.keys(newItems);
    allValues = Object.values(newItems);
    chrome.runtime.sendMessage({ report: items || {} });
  });
}, 10000);

//sending email and clearning the local storage after 12 hrs//(for now 1 min)
//--->needs to be written

const sendMail = () => {
  var allKeys;
  var allValues;
  chrome.storage.local.get(null, function (items) {
    let { stop, active, mail, ...newItems } = items;
    allKeys = Object.keys(newItems);
    allValues = Object.values(newItems);
    apiCall(allKeys, allValues);
  });
};
setInterval(() => {
  sendMail();
}, 60000);
//1 min after

const clearLocalStorage = () => {
  chrome.storage.local.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
};

//====================================================================================
