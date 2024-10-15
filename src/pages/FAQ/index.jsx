import React, { useState } from "react";
import styles from "./index.module.scss";
import Accordion from "../../components/Accordion";
import { accordionItems } from "../../Constants";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`${styles.container} contain_center `}>
      <h2 className={`${styles.faq_heading} poppins-semibold`}>
        {t("Frequently Asked Questions")}
      </h2>
      <div className="accordion">
        {accordionItems.map((item, index) => {
          const formattedIndex = (index + 1).toString().padStart(2, "0");

          console.log(item.content);
          return (
            <Accordion
              key={formattedIndex}
              index={index}
              number={formattedIndex}
              title={t(item.title)}
              content={t(item.content)}
              isOpen={openIndex === index}
              toggleAccordion={toggleAccordion}
              link={item.link || []}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
