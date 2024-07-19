import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, useDotButton } from '@/components/EmblaCarouselDotButton';
import { PrevButton, NextButton, usePrevNextButtons } from '@/components/EmblaCarouselArrowButtons'
import '@/app/embla.css';
import { Button } from "@/components/ui/button";

type EmblaCarouselProps = {
  slides: string[];
  options?: any;
  onDelete: (index: number) => void;
};

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ slides, options, onDelete }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide relative" key={index}>
              <div className="w-64 h-64 relative">
                <img 
                  src={slide} 
                  alt={`Slide ${index + 1}`} 
                  className="w-full h-full object-cover embla__slide__img" 
                />
                <Button 
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                >
                  X
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="embla__buttons">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>

      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={'embla__dot'.concat(
              index === selectedIndex ? ' embla__dot--selected' : ''
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default EmblaCarousel;