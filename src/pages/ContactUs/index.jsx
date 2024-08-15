import React from "react";
import styles from "./index.module.scss";
import girl from "../../assets/contact_us_girl.svg";

const ContactUs = () => {
  return (
    <div className={`${styles.container} contain_center`}>
      <div className={styles.left_side}>
        <h1>Contact Us</h1>
        <p>
          Contact us right now to get started <br /> or if you have any queries.
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
              required
            />
            <input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="*Last Name"
              className={styles.lastname}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="*Email Address"
            required
          />
          <input
            type="number"
            name="number"
            id="number"
            placeholder="*Phone Number"
            required
          />
          <textarea
            name="message"
            id="message"
            placeholder="*Message"
            rows={7}
          ></textarea>
          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
