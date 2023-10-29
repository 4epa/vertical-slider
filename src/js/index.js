const parseTransform = (inputString) => {
  const regex = /[^0-9+\-.]/g;
  return inputString.replace(regex, "");
};

const getEvent = () => {
  return event.type.search("touch") !== -1 ? event.touches[0] : event;
};

class Slider {
  constructor(
    opt = {
      slider: "",
      slides: "",
      sliderTrack: "",
    }
  ) {
    this.slideIndex = 0;
    this.slider = document.querySelector(opt.slider);
    this.sliderTrack = document.querySelector(opt.sliderTrack);
    this.slides = document.querySelectorAll(opt.slides);
    this.slideHeight = this.slides[0].clientHeight;
    this.slideIndex = 0;
    this.posInit = 0;
    this.posY1 = 0;
    this.posFinal = 0;
    this.posThreshold = this.slideHeight * 0.35;
    this.sliderTrack.style.transform = "translate3d(0px, 0px, 0px)";
    this.slider.addEventListener("touchstart", this.swipeStart.bind(this));
    this.slider.addEventListener("mousedown", this.swipeStart.bind(this));

    this.moveHandler = this.swipeAction.bind(this);
    this.endHandler = this.swipeEnd.bind(this);
  }

  slide(action) {
    switch (action) {
      case "next":
        ++this.slideIndex;
        if (this.slideIndex > this.slides.length - 1) this.slideIndex = 0;
        break;
      case "prev":
        --this.slideIndex;
        if (this.slideIndex < 0) this.slideIndex = this.slides.length - 1;
        break;
    }

    this.sliderTrack.style.transition = "transform 0.5s";
    this.sliderTrack.style.transform = `translate3d(0px, -${
      this.slideIndex * this.slideHeight
    }px, 0px)`;
  }

  swipeStart() {
    const event = getEvent();

    this.posInit = event.clientY;
    this.posY1 = event.clientY;

    this.sliderTrack.style.transition = "";

    document.addEventListener("touchmove", this.moveHandler);
    document.addEventListener("touchend", this.endHandler);
    document.addEventListener("mousemove", this.moveHandler);
    document.addEventListener("mouseup", this.endHandler);
  }

  swipeAction() {
    const event = getEvent();

    const style = this.sliderTrack.style.transform;
    const transform = parseTransform(style.split(" ")[1]);

    const scrolled = this.posY1 - event.clientY;
    this.posY1 = event.clientY;

    this.sliderTrack.style.transform = `translate3d(0px, ${
      transform - scrolled
    }px, 0px)`;
  }

  swipeEnd() {
    const posY1 = this.posY1;
    const posInit = this.posInit;

    this.posFinal = posInit - posY1;

    document.removeEventListener("touchmove", this.moveHandler);
    document.removeEventListener("mousemove", this.moveHandler);
    document.removeEventListener("touchend", this.endHandler);
    document.removeEventListener("mouseup", this.endHandler);

    if (Math.abs(this.posFinal) > this.posThreshold) {
      if (posInit < posY1) {
        this.slide("prev");
      } else if (posInit > posY1) {
        this.slide("next");
      }
    }

    if (posInit !== posY1) {
      this.slide();
    }
  }
}

let slider = new Slider({
  slider: ".slider",
  slides: ".slider__item",
  sliderTrack: ".slider__track",
});
