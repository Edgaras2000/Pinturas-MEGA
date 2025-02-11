import { useState } from 'react';

const Carrucel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    
    { content: '', imgSrc: '/img/caca 3.jfif.jpg' },
    { content: '', imgSrc: '/img/2.jpg' }
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };


const caca = () => {


}

  return (
    <div className="relative w-full shadow-xl">
     

      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
       
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.imgSrc} className="block w-full h-full object-cover" onClick={caca} alt={`Diapositiva ${index + 1}`} />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4">{slide.content}</div>
          </div>
        ))}
      </div>

     
      <button
        type="button"
        className="text-red-400 text-4xl absolute top-1/2 left-2 z-1 transform -translate-y-1/2 p-2 bg-slate-100 rounded-full shadow-inner  hover:ring-4 "
        onClick={prevSlide}
      >
       <i class="fa-solid fa-arrow-left"></i>
      </button>
      <button
        type="button"
        className=" text-red-400 text-4xl  absolute top-1/2 right-2 z-1 transform -translate-y-1/2 p-2 bg-slate-100 rounded-full shadow-inner hover:ring-4 "
        onClick={nextSlide}
      >
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Carrucel;
