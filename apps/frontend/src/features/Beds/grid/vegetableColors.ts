// Map seed names to their colors for visual distinction
export const getVegetableColor = (seedName: string): string => {
  const lowerName = seedName.toLowerCase();
  const colorMap: Record<string, string> = {
    // Tomatoes (English & Dutch)
    tomato: "bg-red-500",
    tomaat: "bg-red-500",
    // Carrots (English & Dutch)
    carrot: "bg-orange-500",
    wortel: "bg-orange-500",
    wortels: "bg-orange-500",
    // Cucumbers (English & Dutch)
    cucumber: "bg-green-600",
    komkommer: "bg-green-600",
    // Zucchini (English & Dutch)
    zucchini: "bg-green-600",
    courgette: "bg-green-600",
    // Herbs (English & Dutch)
    basil: "bg-green-500",
    basilicum: "bg-green-500",
    parsley: "bg-green-500",
    peterselie: "bg-green-500",
    chives: "bg-green-500",
    bieslook: "bg-green-500",
    // Spinach (English & Dutch)
    spinach: "bg-green-700",
    spinazie: "bg-green-700",
    // Kale (English & Dutch)
    kale: "bg-green-700",
    boerenkool: "bg-green-700",
    "tuscan kale": "bg-green-700",
    // Chard (English & Dutch)
    "swiss chard": "bg-blue-600",
    snijbiet: "bg-blue-600",
    // Peppers (English & Dutch)
    pepper: "bg-yellow-500",
    paprika: "bg-yellow-500",
    peper: "bg-yellow-500",
    // Beans (English & Dutch)
    bean: "bg-amber-600",
    boon: "bg-amber-600",
    bonen: "bg-amber-600",
    "broad bean": "bg-amber-600",
    // Peas (English & Dutch)
    "winter pea": "bg-amber-600",
    erwtje: "bg-amber-600",
    erwt: "bg-amber-600",
    sugarsnap: "bg-amber-600",
    // Beetroot (English & Dutch)
    beetroot: "bg-purple-600",
    biet: "bg-purple-600",
    "rode biet": "bg-purple-600",
    // Radish (English & Dutch)
    radish: "bg-pink-500",
    radijs: "bg-pink-500",
    // Lettuce & Salads (English & Dutch)
    lettuce: "bg-lime-500",
    sla: "bg-lime-500",
    andijvie: "bg-lime-500",
    // Cabbage (English & Dutch)
    cabbage: "bg-green-600",
    kool: "bg-green-600",
    koolrabi: "bg-green-600",
    "white cabbage": "bg-gray-400",
    "witte kool": "bg-gray-400",
    "pointed cabbage": "bg-green-600",
    spitskool: "bg-green-600",
    // Broccoli
    broccoli: "bg-green-700",
    // Cauliflower (English & Dutch)
    cauliflower: "bg-gray-350",
    bloemkool: "bg-gray-350",
    // Leek (English & Dutch)
    leek: "bg-green-600",
    prei: "bg-green-600",
    // Corn (English & Dutch)
    corn: "bg-yellow-400",
    mais: "bg-yellow-400",
    "corn salad": "bg-green-500",
    // Sunflower (English & Dutch)
    sunflower: "bg-yellow-400",
    zonnebloem: "bg-yellow-400",
    // Edible flowers (English & Dutch)
    tagette: "bg-orange-400",
    marigold: "bg-orange-400",
    calendula: "bg-orange-300",
    nasturtium: "bg-orange-500",
    borage: "bg-blue-400",
    cornflower: "bg-blue-500",
    pansy: "bg-purple-400",
    violet: "bg-purple-500",
    chrysanthemum: "bg-pink-400",
    rose: "bg-red-400",
    flower: "bg-pink-300",
    bloem: "bg-pink-300",
    bloemen: "bg-pink-300",
  };

  return colorMap[lowerName] || "bg-emerald-500";
};
