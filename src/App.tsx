import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import Barchart from "./Barchart";
import Email from "./Email";

const App = () => {
  const [url, setUrl] = React.useState<string>("");
  const [time, setTime] = React.useState<any>(0);
  const [keys, setKeys] = React.useState<any>([]);
  const [values, setValues] = React.useState<any>([]);
  const [message, setMessage] = React.useState("");
  const [mail, setMail] = React.useState("");

  //sorting logic to show in graphs
  function sortAssocObject(list: any) {
    var sortable = [];
    for (var key in list) {
      sortable.push([key, list[key]]);
    }

    sortable.sort(function (a, b) {
      return a[1] > b[1] ? -1 : a[1] > b[1] ? 1 : 0;
    });
    var orderedList: any = {};
    for (var idx in sortable) {
      orderedList[sortable[idx][0]] = sortable[idx][1];
    }

    return orderedList;
  }
  //<----rerendering due to the message received from backgroundScript---->//
  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((message: any) => {
      if (message) {
        setTime(message.seconds);
        setUrl(message.activeUrl);
      }
    });
    chrome.runtime.onMessage.addListener((message: any) => {
      if (message["report"]) {
        let { stop, active, mail, ...newItems } = message["report"];
        newItems = sortAssocObject(newItems);
        setKeys(Object.keys(newItems));
        setValues(Object.values(newItems));
      }
    });
  }, []);

  //<----initial loading --->//
  React.useEffect(() => {
    chrome.storage.local.get(null, function (items) {
      let { stop, active, mail, ...newItems } = items;
      newItems = sortAssocObject(newItems);
      setKeys(Object.keys(newItems));
      setValues(Object.values(newItems));
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{time}</p>
        <p>{url}</p>
      </header>

      {keys.length && values.length ? (
        <Barchart labels={keys} datum={values} />
      ) : (
        ""
      )}

      {keys.length && values.length ? (
        <Email labels={keys} datum={values} />
      ) : (
        ""
      )}

      {/* <button>Refresh</button> */}
    </div>
  );
};
export default App;
