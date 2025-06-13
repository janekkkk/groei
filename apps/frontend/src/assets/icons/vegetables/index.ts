// Vegetable SVG Icons
// Export all vegetable icons for easy importing

import BasilIcon from "./basil.svg";
import BeetrootIcon from "./beetroot.svg";
import BroadBeanIcon from "./broad-bean.svg";
import BroccoliIcon from "./broccoli.svg";
import CarrotIcon from "./carrot.svg";
import CauliflowerIcon from "./cauliflower.svg";
import ChivesIcon from "./chives.svg";
import CornIcon from "./corn.svg";
import CornSaladIcon from "./corn-salad.svg";
import CucumberIcon from "./cucumber.svg";
import EggplantIcon from "./eggplant.svg";
import KaleIcon from "./kale.svg";
import LeekIcon from "./leek.svg";
import ParsleyIcon from "./parsley.svg";
import PointedCabbageIcon from "./pointed-cabbage.svg";
import RadishIcon from "./radish.svg";
import SpinachIcon from "./spinach.svg";
import SugarsnapIcon from "./sugarsnap.svg";
import SunflowerIcon from "./sunflower.svg";
import SwissChardIcon from "./swiss-chard.svg";
import TomatoIcon from "./tomato.svg";
import TuscanKaleIcon from "./tuscan-kale.svg";
import WhiteCabbageIcon from "./white-cabbage.svg";
import WinterPeaIcon from "./winter-pea.svg";
import ZucchiniIcon from "./zucchini.svg";

// Re-export all icons for external use
export {
  BasilIcon,
  BeetrootIcon,
  BroadBeanIcon,
  BroccoliIcon,
  CarrotIcon,
  CauliflowerIcon,
  ChivesIcon,
  CornIcon,
  CornSaladIcon,
  CucumberIcon,
  EggplantIcon,
  KaleIcon,
  LeekIcon,
  ParsleyIcon,
  PointedCabbageIcon,
  RadishIcon,
  SpinachIcon,
  SugarsnapIcon,
  SunflowerIcon,
  SwissChardIcon,
  TomatoIcon,
  TuscanKaleIcon,
  WhiteCabbageIcon,
  WinterPeaIcon,
  ZucchiniIcon,
};

// Type for all available vegetable icons
export type VegetableIconType =
  | "basil"
  | "beetroot"
  | "broad-bean"
  | "broccoli"
  | "carrot"
  | "cauliflower"
  | "chives"
  | "corn"
  | "corn-salad"
  | "cucumber"
  | "eggplant"
  | "kale"
  | "leek"
  | "parsley"
  | "pointed-cabbage"
  | "radish"
  | "spinach"
  | "sugarsnap"
  | "sunflower"
  | "swiss-chard"
  | "tomato"
  | "tuscan-kale"
  | "white-cabbage"
  | "winter-pea"
  | "zucchini";

// Icon mapping for dynamic icon selection
export const vegetableIcons = {
  basil: BasilIcon,
  beetroot: BeetrootIcon,
  "broad-bean": BroadBeanIcon,
  broccoli: BroccoliIcon,
  carrot: CarrotIcon,
  cauliflower: CauliflowerIcon,
  chives: ChivesIcon,
  corn: CornIcon,
  "corn-salad": CornSaladIcon,
  cucumber: CucumberIcon,
  eggplant: EggplantIcon,
  kale: KaleIcon,
  leek: LeekIcon,
  parsley: ParsleyIcon,
  "pointed-cabbage": PointedCabbageIcon,
  radish: RadishIcon,
  spinach: SpinachIcon,
  sugarsnap: SugarsnapIcon,
  sunflower: SunflowerIcon,
  "swiss-chard": SwissChardIcon,
  tomato: TomatoIcon,
  "tuscan-kale": TuscanKaleIcon,
  "white-cabbage": WhiteCabbageIcon,
  "winter-pea": WinterPeaIcon,
  zucchini: ZucchiniIcon,
} as const;

// Helper function to get icon by name
export const getVegetableIcon = (iconName: VegetableIconType) => {
  return vegetableIcons[iconName];
};
