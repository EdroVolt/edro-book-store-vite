import { Children, isValidElement, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

import styles from "./carousel.module.css";

type HorizontalCarouselHOCProps = {
  options?: EmblaOptionsType;
  children: ReactNode | ReactNode[];
  numberOfSlides?: number;
  title?: string;
};

export default function HorizontalCarouselHOC({
  children,
  numberOfSlides = 3,
  options,
  title,
}: HorizontalCarouselHOCProps) {
  const [emblaRef] = useEmblaCarousel({ align: "start", ...options });

  const slides = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      const formattedChild = (
        <div className={styles["embla__slide"]} key={index}>
          <div className={styles["embla__slide__number"]}>{child}</div>
        </div>
      );
      return formattedChild;
    }
    return child;
  });

  return (
    <section
      className={styles["embla"]}
      style={
        {
          "--slide-size-lg": `calc(100% / ${numberOfSlides})`,
        } as React.CSSProperties
      }
    >
      {title ? (
        <div className="flex mb-8">
          <span className="text-[26px] font-semibold">{title}</span>
        </div>
      ) : null}

      <div className={styles["embla__viewport"]} ref={emblaRef}>
        <div className={styles["embla__container"]}>{slides}</div>
      </div>
    </section>
  );
}
