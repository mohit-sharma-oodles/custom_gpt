import React from "react";
import styles from "./index.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";

// assets
// import defaultUser from "../../assets/person_default.png";
import testimonial_lady from "../../assets/testimonial_lady.png";

import "swiper/scss";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import "swiper/scss/effect-coverflow";

import {
  Pagination,
  Navigation,
  EffectCoverflow,
  Autoplay,
} from "swiper/modules";
import { testimonials } from "../../Constants";

const Testimonials = () => {
  return (
    <div className={styles.container}>
      <Swiper
        style={{
          "--swiper-pagination-color": "#ae407a",
        }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        draggable={true}
        modules={[Pagination, EffectCoverflow, Autoplay]}
        watchOverflow={true}
        init={false}
        speed={800}
        slidesPerView={2.8}
        spaceBetween={30}
        centeredSlides={true}
        effect="coverflow"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 0.6,
          slideShadows: false,
        }}
        grabCursor={true}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        className={styles.swiper}
      >
        {testimonials.map((test, idx) => {
          return (
            <SwiperSlide key={idx} className={styles.swiperSlide}>
              <div className={styles.wrapper}>
                <div className={styles.internal}>
                  <div className={styles.left}>
                    <img src={testimonial_lady} alt="" />
                  </div>
                  <div className={styles.right}>
                    <div className={styles.name}>{test.name}</div>
                    <div className={styles.position}>{test.title}</div>
                    <div className={styles.work}>{test.message}</div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        {/* <div className={styles.swiper_pagination}></div> */}
      </Swiper>
    </div>
  );
};

export default Testimonials;
