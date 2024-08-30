import React, { useState } from "react";
import styles from "./index.module.scss";

const Testimonial = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(testimonials.length / 2)
  );

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleBulletClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.testimonial}>
        <div
          className={`${styles.card} ${activeIndex === 0 ? styles.active : ""}`}
        >
          <div className={styles.content}>
            <img
              src={testimonials[activeIndex].image}
              alt={testimonials[activeIndex].name}
              className={styles.image}
            />
            <h3 className={styles.name}>{testimonials[activeIndex].name}</h3>
            <p className={styles.title}>{testimonials[activeIndex].title}</p>
            <p className={styles.message}>
              {testimonials[activeIndex].message}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.bullets}>
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`${styles.bullet} ${
              index === activeIndex ? styles.active : ""
            }`}
            onClick={() => handleBulletClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
