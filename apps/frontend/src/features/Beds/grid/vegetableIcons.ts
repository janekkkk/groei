import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Circle,
  Clover,
  Droplets,
  Flame,
  Flower2,
  Leaf,
  Sprout,
  Square,
  Sun,
  Wind,
  Zap,
} from "lucide-react";

// Map seed names to their corresponding Lucide icons
export const getVegetableIcon = (seedName: string): LucideIcon => {
  const lowerName = seedName.toLowerCase();

  // Leafy vegetables (English & Dutch)
  if (
    lowerName.includes("spinach") ||
    lowerName.includes("spinazie") ||
    lowerName.includes("kale") ||
    lowerName.includes("boerenkool") ||
    lowerName.includes("chard") ||
    lowerName.includes("snijbiet") ||
    lowerName.includes("lettuce") ||
    lowerName.includes("sla") ||
    lowerName.includes("andijvie") ||
    lowerName.includes("endive")
  ) {
    return Leaf;
  }

  // Round vegetables (English & Dutch)
  if (
    lowerName.includes("tomato") ||
    lowerName.includes("tomaat") ||
    lowerName.includes("radish") ||
    lowerName.includes("radijs") ||
    lowerName.includes("beetroot") ||
    lowerName.includes("biet") ||
    lowerName.includes("rode biet")
  ) {
    return Circle;
  }

  // Root vegetables & elongated (English & Dutch)
  if (
    lowerName.includes("carrot") ||
    lowerName.includes("wortel") ||
    lowerName.includes("wortels") ||
    lowerName.includes("leek") ||
    lowerName.includes("prei") ||
    lowerName.includes("parsnip") ||
    lowerName.includes("pastinaak")
  ) {
    return Zap;
  }

  // Flowers & Brassicas (English & Dutch)
  if (
    lowerName.includes("broccoli") ||
    lowerName.includes("cauliflower") ||
    lowerName.includes("bloemkool") ||
    lowerName.includes("cabbage") ||
    lowerName.includes("kool") ||
    lowerName.includes("koolrabi") ||
    lowerName.includes("koolraap")
  ) {
    return Flower2;
  }

  // Vine vegetables (English & Dutch)
  if (
    lowerName.includes("cucumber") ||
    lowerName.includes("komkommer") ||
    lowerName.includes("zucchini") ||
    lowerName.includes("courgette") ||
    lowerName.includes("melon") ||
    lowerName.includes("meloen")
  ) {
    return Droplets;
  }

  // Herbs (English & Dutch)
  if (
    lowerName.includes("basil") ||
    lowerName.includes("basilicum") ||
    lowerName.includes("parsley") ||
    lowerName.includes("peterselie") ||
    lowerName.includes("chives") ||
    lowerName.includes("bieslook") ||
    lowerName.includes("herb")
  ) {
    return Wind;
  }

  // Legumes (English & Dutch)
  if (
    lowerName.includes("bean") ||
    lowerName.includes("boon") ||
    lowerName.includes("bonen") ||
    lowerName.includes("pea") ||
    lowerName.includes("erwtje") ||
    lowerName.includes("erwt") ||
    lowerName.includes("legume")
  ) {
    return Clover;
  }

  // Corns (English & Dutch)
  if (
    lowerName.includes("corn") ||
    lowerName.includes("maize") ||
    lowerName.includes("mais")
  ) {
    return Square;
  }

  // Edible flowers (English & Dutch)
  if (
    lowerName.includes("tagette") ||
    lowerName.includes("marigold") ||
    lowerName.includes("calendula") ||
    lowerName.includes("nasturtium") ||
    lowerName.includes("borage") ||
    lowerName.includes("cornflower") ||
    lowerName.includes("pansy") ||
    lowerName.includes("violet") ||
    lowerName.includes("chrysanthemum") ||
    lowerName.includes("rose") ||
    lowerName.includes("flower") ||
    lowerName.includes("bloem") ||
    lowerName.includes("bloemen")
  ) {
    return Flower2;
  }

  // Sunflower (English & Dutch)
  if (lowerName.includes("sunflower") || lowerName.includes("zonnebloem")) {
    return Sun;
  }

  // Peppers & hot vegetables (English & Dutch)
  if (
    lowerName.includes("pepper") ||
    lowerName.includes("paprika") ||
    lowerName.includes("peper") ||
    lowerName.includes("chili") ||
    lowerName.includes("chilli") ||
    lowerName.includes("hot")
  ) {
    return Flame;
  }

  // Default for anything else
  return Sprout;
};

// Export all icons for reference
export {
  Leaf,
  Circle,
  Square,
  Flame,
  Flower2,
  Droplets,
  Zap,
  Sprout,
  Apple,
  Clover,
  Wind,
  Sun,
};
