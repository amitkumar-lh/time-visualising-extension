import * as React from "react";
import axios from "axios";

const Email = ({ labels, datum }: any) => {
  const [message, setMessage] = React.useState("");
  const [mail, setMail] = React.useState("");

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleMail = (e: any) => {
    setMail(e.target.value);
    console.log("labels", labels);
  };
  //   const handleSubmit = () => {
  //     apiCall();
  //   };

  // const apiCall = async () => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/send", {
  //       labels: labels,
  //       datum: datum,
  //       message: message,
  //       mail: mail,
  //     });
  //     if (response.status === 200) {
  //       alert("email sent");
  //       setMail("");
  //       setMessage("");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleClick = () => {
    chrome.storage.local.set({ mail: mail });
    // chrome.runtime.sendMessage({"mail":true}),
  };

  React.useEffect(() => {
    // let interval: any;
    // interval = setInterval(() => {
    //   apiCall();
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <form>
      <input
        type="text"
        value={message}
        placeholder={"Give Name here"}
        onChange={handleChange}
      ></input>
      <input
        type="text"
        value={mail}
        placeholder={"Give MailId here"}
        onChange={handleMail}
      ></input>
      <button type="submit" onClick={handleClick}>
        {" "}
        Send Mail?
      </button>
    </form>
  );
};
export default Email;
