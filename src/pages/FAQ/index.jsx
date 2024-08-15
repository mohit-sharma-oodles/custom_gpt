import React, { useState } from "react";
import styles from "./index.module.scss";
import Accordion from "../../components/Accordion";
import { accordionItems } from "../../Constants";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`${styles.container} contain_center `}>
      <h2 className={`${styles.faq_heading} poppins-semibold`}>
        Frequently Asked Questions
      </h2>
      <div className="accordion">
        {accordionItems.map((item, index) => {
          const formattedIndex = (index + 1).toString().padStart(2, "0");

          return (
            <Accordion
              key={formattedIndex} // Using formattedIndex for the key
              index={index}
              number={formattedIndex}
              title={item.title}
              content={item.content}
              isOpen={openIndex === index}
              toggleAccordion={toggleAccordion}
              link={item.link || []} // Ensuring link is always an array
            />
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
