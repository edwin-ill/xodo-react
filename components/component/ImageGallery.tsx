import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { XIcon, PlusSquareIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  onDelete: (index: number) => void;
  onAdd: (files: FileList) => void;
}

export function ImageGallery({ images, onDelete, onAdd }: ImageGalleryProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAdd(e.target.files);
    }
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img src={image} alt={`Vehicle image ${index + 1}`} className="w-full h-64 object-cover" />
            <Button 
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600"
              onClick={() => onDelete(index)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </Slider>
      <label htmlFor="add-image" className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
        <PlusSquareIcon className="w-6 h-6" />
      </label>
      <input 
        id="add-image"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}