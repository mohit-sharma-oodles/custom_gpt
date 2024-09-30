import React, { useState } from "react";
import styles from "./index.module.scss";
import girl from "../../assets/contact_us_girl.svg";
import { axios_instance } from "../../Axios/axiosInstance";

const ContactUs = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await axios_instance.post("contact-us/", {
        first_name: firstname,
        last_name: lastname,
        email: email,
        phone: number,
        message: text,
      });

      const data = resp.data;
      setMessage(data.message);
      setStatus(data.status);
      // console.log(data);
    } catch (e) {
      setMessage(e.response.data.message.message);
      // console.log(e.response.data.message.message);
      // console.log(e.message);
    }
  };

  return (
    <div className={`${styles.container} contain_center`}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div className={styles.left_side}>
          <h1>Contact Us</h1>
          <p>
            Contact us right now to get started <br /> or if you have any
            queries.
          </p>
          <img src={girl} />
        </div>
        <div className={styles.right_side}>
          <form action="" className={styles.form}>
            <div className={styles.form_names}>
              <input
                type="text"
                name="first_name"
                id="first_name"
                placeholder="*First Name"
                className={styles.firstname}
                value={firstname}
                onChange={(e) => setFirstName(e.target.value.trim())}
                required
              />
              <input
                type="text"
                name="last_name"
                id="last_name"
                placeholder="*Last Name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value.trim())}
                className={styles.lastname}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              id="email"
              placeholder="*Email Address"
              required
            />
            <input
              type="tel"
              name="number"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="*Phone Number"
              required
            />
            <textarea
              name="message"
              id="message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="*Message"
              rows={7}
            ></textarea>
            <button
              type="submit"
              className={styles.button}
              onClick={handleSubmit}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      {message && status === "success" ? (
        <p style={{ color: "black" }} className={styles.message}>
          {message}
        </p>
      ) : (
        <p style={{ color: "red" }} className={styles.message}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ContactUs;
