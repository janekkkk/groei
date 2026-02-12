import { Circle, Droplets, Flame, Leaf, Sprout, Sun } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import {
  BasilIcon,
  BeanIcon,
  BellPepperIcon,
  BroccoliIcon,
  CabbageIcon,
  CarrotIcon,
  CauliflowerIcon,
  ChardIcon,
  ChivesIcon,
  CornIcon,
  CucumberIcon,
  FlowerIcon,
  GarlicIcon,
  KaleIcon,
  LettuceIcon,
  OnionIcon,
  ParsleyIcon,
  ParsnipIcon,
  PeaIcon,
  PreiIcon,
  RadishIcon,
  SpinachIcon,
  TomatoIcon,
  ZucchiniIcon,
} from "./vegetableSvgIcons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const getVegetableIcon = (seedName: string): IconComponent => {
  const lowerName = seedName.toLowerCase();

  if (lowerName.includes("tomato") || lowerName.includes("tomaat"))
    return TomatoIcon;
  if (lowerName.includes("carrot") || lowerName.includes("wortel"))
    return CarrotIcon;
  if (lowerName.includes("radish") || lowerName.includes("radijs"))
    return RadishIcon;
  if (
    lowerName.includes("beetroot") ||
    lowerName.includes("biet") ||
    lowerName.includes("rode biet")
  )
    return Circle;
  if (lowerName.includes("spinach") || lowerName.includes("spinazie"))
    return SpinachIcon;
  if (lowerName.includes("kale") || lowerName.includes("boerenkool"))
    return KaleIcon;
  if (
    lowerName.includes("lettuce") ||
    lowerName.includes("sla") ||
    lowerName.includes("andijvie") ||
    lowerName.includes("endive")
  )
    return LettuceIcon;
  if (lowerName.includes("chard") || lowerName.includes("snijbiet"))
    return ChardIcon;
  if (lowerName.includes("cucumber") || lowerName.includes("komkommer"))
    return CucumberIcon;
  if (lowerName.includes("zucchini") || lowerName.includes("courgette"))
    return ZucchiniIcon;
  if (lowerName.includes("melon") || lowerName.includes("meloen"))
    return Droplets;
  if (lowerName.includes("basil") || lowerName.includes("basilicum"))
    return BasilIcon;
  if (lowerName.includes("parsley") || lowerName.includes("peterselie"))
    return ParsleyIcon;
  if (lowerName.includes("chives") || lowerName.includes("bieslook"))
    return ChivesIcon;
  if (
    lowerName.includes("pepper") ||
    lowerName.includes("paprika") ||
    lowerName.includes("peper")
  )
    return BellPepperIcon;
  if (
    lowerName.includes("chili") ||
    lowerName.includes("chilli") ||
    lowerName.includes("hot")
  )
    return Flame;
  if (
    lowerName.includes("bean") ||
    lowerName.includes("boon") ||
    lowerName.includes("bonen")
  )
    return BeanIcon;
  if (
    lowerName.includes("pea") ||
    lowerName.includes("erwtje") ||
    lowerName.includes("erwt")
  )
    return PeaIcon;
  if (lowerName.includes("legume")) return PeaIcon;
  if (lowerName.includes("broccoli")) return BroccoliIcon;
  if (lowerName.includes("cauliflower") || lowerName.includes("bloemkool"))
    return CauliflowerIcon;
  if (lowerName.includes("cabbage") || lowerName.includes("kool"))
    return CabbageIcon;
  if (lowerName.includes("koolrabi") || lowerName.includes("koolraap"))
    return Circle;
  if (lowerName.includes("leek") || lowerName.includes("prei")) return PreiIcon;
  if (lowerName.includes("onion") || lowerName.includes("ui")) return OnionIcon;
  if (lowerName.includes("garlic") || lowerName.includes("knoflook"))
    return GarlicIcon;
  if (lowerName.includes("parsnip") || lowerName.includes("pastinaak"))
    return ParsnipIcon;
  if (
    lowerName.includes("corn") ||
    lowerName.includes("maize") ||
    lowerName.includes("mais")
  )
    return CornIcon;
  if (lowerName.includes("corn salad")) return Leaf;
  if (lowerName.includes("sunflower") || lowerName.includes("zonnebloem"))
    return Sun;
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
  )
    return FlowerIcon;
  if (lowerName.includes("herb")) return BasilIcon;

  return Sprout;
};
