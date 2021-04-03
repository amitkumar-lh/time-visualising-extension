
//function for getting away from chrome!-->PageVisibilityApi

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.action === "Stopped") {
    // console.log("stopped");
    if (document.hidden) {
        chrome.storage.local.set({ stop: true });
      } else {
        chrome.storage.local.set({ stop: false });
      }
  }
});

//function for blackening certain sites

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.action === "Blocked") {
    var divs = document.querySelectorAll("div");
    if (divs.length === 0) alert("There r no divs on this page ");
    else {
      console.log("Before for loop");
      for (var i = 0; i < divs.length; i++) {
        divs[i].style.backgroundColor = "black";
      }
      console.log("After for loop");
    }
  }
});































