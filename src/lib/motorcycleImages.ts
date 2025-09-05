import suzukiDR160 from "@/assets/suzuki-dr160.jpg";
import hondaCG160 from "@/assets/honda-cg160.jpg";
import yamahaFactor150 from "@/assets/yamaha-factor150.jpg";
import hondaBros160 from "@/assets/honda-bros160.jpg";
import yamahaXTZ150 from "@/assets/yamaha-xtz150.jpg";

interface MotorcycleImageMap {
  [key: string]: string;
}

// Mapping of brand + model to images
const motorcycleImages: MotorcycleImageMap = {
  // Honda models
  "honda cg": hondaCG160,
  "honda cg 160": hondaCG160,
  "honda cg160": hondaCG160,
  "honda bros": hondaBros160,
  "honda bros 160": hondaBros160,
  "honda bros160": hondaBros160,
  
  // Yamaha models
  "yamaha factor": yamahaFactor150,
  "yamaha factor 150": yamahaFactor150,
  "yamaha factor150": yamahaFactor150,
  "yamaha xtz": yamahaXTZ150,
  "yamaha xtz 150": yamahaXTZ150,
  "yamaha xtz150": yamahaXTZ150,
  "yamaha crosser": yamahaXTZ150,
  
  // Suzuki models
  "suzuki dr": suzukiDR160,
  "suzuki dr 160": suzukiDR160,
  "suzuki dr160": suzukiDR160,
};

/**
 * Gets the appropriate motorcycle image based on brand and model
 */
export const getMotorcycleImage = (brand?: string, model?: string, imageUrls?: string[]): string => {
  // First, try to use the image from database if available
  if (imageUrls && imageUrls.length > 0 && imageUrls[0]) {
    return imageUrls[0];
  }
  
  // If no brand or model provided, return default
  if (!brand && !model) {
    return suzukiDR160;
  }
  
  // Create search key by combining brand and model
  const searchKey = `${brand || ''} ${model || ''}`.toLowerCase().trim();
  
  // Try exact match first
  if (motorcycleImages[searchKey]) {
    return motorcycleImages[searchKey];
  }
  
  // Try partial matches
  for (const key in motorcycleImages) {
    if (searchKey.includes(key) || key.includes(searchKey)) {
      return motorcycleImages[key];
    }
  }
  
  // Try brand-only matches
  if (brand) {
    const brandLower = brand.toLowerCase();
    for (const key in motorcycleImages) {
      if (key.startsWith(brandLower)) {
        return motorcycleImages[key];
      }
    }
  }
  
  // Default fallback
  return suzukiDR160;
};

/**
 * Gets all available motorcycle images for display purposes
 */
export const getAllMotorcycleImages = () => {
  return {
    suzukiDR160,
    hondaCG160,
    yamahaFactor150,
    hondaBros160,
    yamahaXTZ150,
  };
};