import { useEffect, useState } from "react";

const Main = () => {
  const [input, setInput] = useState("");
  const [timeOff, setTimeOff] = useState(false);
  const [message, setMessage] = useState(false);
  const [data, setData] = useState([]);
  const [quote, setQuote] = useState();

  async function getData() {
    try {
      const response = await fetch("quotes.json");
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const res = await response.json();
      setData(res);
    } catch (error) {
      console.error(error.message);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "quote") {
      if (data.length >= 1) {
        console.log("Sending Quote...");
        let x = Math.floor(Math.random() * (data.length - 0 + 1)) + 0;
        setQuote(data[x]?.quote);
        chrome.runtime.sendMessage({ Quotes: quote }, (response) => {
          console.log("response of the Quote", response);
        });
      }
    }
  });

  const handleClickOn = () => {
    if (input !== "") {
      chrome.runtime.sendMessage({ setTime: input }, (response) => {
        console.log("Button Clicked: ", response);
      });
      setMessage(false);
    } else {
      setMessage(true);
    }
  };

  const handleClickOff = () => {
    chrome.runtime.sendMessage({ setTimeOff: "1" }, (response) => {
      console.log(response);
    });
    setTimeOff(true);
    setTimeout(() => setTimeOff(false), 5000);
  };

  return (
    <>
      <input
        type="number"
        onChange={(e) => setInput(parseInt(e.target.value))}
      />
      {message && <p>Write a number in Minutes</p>}
      {timeOff && <p>Notifications has Stopped.</p>}
      <button onClick={handleClickOn}>Add</button>
      <button onClick={handleClickOff}>Stop</button>
    </>
  );
};

export default Main;
