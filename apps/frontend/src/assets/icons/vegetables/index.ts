// Vegetable SVG Icons
// Export all vegetable icons for easy importing

export { default as BasilIcon } from "./basil.svg";
export { default as BeetrootIcon } from "./beetroot.svg";
export { default as BroadBeanIcon } from "./broad-bean.svg";
export { default as BroccoliIcon } from "./broccoli.svg";
export { default as CarrotIcon } from "./carrot.svg";
export { default as CauliflowerIcon } from "./cauliflower.svg";
export { default as ChivesIcon } from "./chives.svg";
export { default as CornIcon } from "./corn.svg";
export { default as CornSaladIcon } from "./corn-salad.svg";
export { default as CucumberIcon } from "./cucumber.svg";
export { default as EggplantIcon } from "./eggplant.svg";
export { default as KaleIcon } from "./kale.svg";
export { default as LeekIcon } from "./leek.svg";
export { default as ParsleyIcon } from "./parsley.svg";
export { default as PointedCabbageIcon } from "./pointed-cabbage.svg";
export { default as RadishIcon } from "./radish.svg";
export { default as SpinachIcon } from "./spinach.svg";
export { default as SugarsnapIcon } from "./sugarsnap.svg";
export { default as SunflowerIcon } from "./sunflower.svg";
export { default as SwissChardIcon } from "./swiss-chard.svg";
export { default as TomatoIcon } from "./tomato.svg";
export { default as TuscanKaleIcon } from "./tuscan-kale.svg";
export { default as WhiteCabbageIcon } from "./white-cabbage.svg";
export { default as WinterPeaIcon } from "./winter-pea.svg";
export { default as ZucchiniIcon } from "./zucchini.svg";

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
