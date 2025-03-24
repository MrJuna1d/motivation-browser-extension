console.log("background Script Loaded");

function setQuote(quote) {
  chrome.alarms.onAlarm.addListener(() => {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "assets/icon48.png",
        title: "This is a test",
        message: quote,
        silent: false,
      },
      () => {}
    );
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.Quotes) {
    console.log("Quote: ", request.Quotes);
    setQuote(request.Quotes);
    sendResponse({
      status: "Quote Recevied successfully",
    });
  }
  if (request.setTime) {
    console.log("Time Started: ", request.setTime);
    const time = request.setTime * 60 * 1000; // time in minutes
    setInterval(
      () =>
        chrome.runtime.sendMessage({ action: "quote" }, (response) => {
          console.log("asked for the Quote: ", response);
        }),
      time
    );
    createAlarm(request.setTime);
    sendResponse({
      status: "Success ",
    });
  }
  if (request.setTimeOff) alarmOff();

  true;
});

function alarmOff() {
  chrome.alarms.clear("Testing", (wasCleared) => {
    console.log("wasCleared", wasCleared);
  });
}

function createAlarm(num) {
  chrome.alarms.create("Testing", {
    delayInMinutes: num,
    periodInMinutes: num,
  });
}
