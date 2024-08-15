import React, { useState } from "react";
import styles from "./index.module.scss";
import { PiCaretCircleDown } from "react-icons/pi";
import { PiCaretCircleUp } from "react-icons/pi";

const Accordion = ({
  title,
  content,
  index,
  isOpen,
  toggleAccordion,
  number,
  link = [],
}) => {
  return (
    <div className={styles.accordionItem}>
      <div
        className={styles.accordionHeader}
        onClick={() => toggleAccordion(index)}
      >
        <div className={styles.leftSide}>
          <h1 className={styles.number}>{number}</h1>
          <p className={`${styles.accordion_title} poppins-semibold`}>
            {title}
          </p>
        </div>
        <span className={styles.arrow}>
          {isOpen ? (
            <PiCaretCircleUp size={24} color={"#ae407a"} />
          ) : (
            <PiCaretCircleDown size={24} />
          )}
        </span>
      </div>
      <div
        className={`${styles.accordionContent} ${isOpen ? styles.open : ""}`}
      >
        <p>{content}</p>
        {link.length > 0 && (
          <div className={styles.links}>
            {link.map((currLink, idx) => (
              <a
                href={currLink}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
                className={styles.link}
              >
                {currLink}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
