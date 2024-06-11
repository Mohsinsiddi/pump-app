export const getHighlightingPriceHelper = (slot: number) => {
  switch (slot) {
    case 1:
      return 0.5;
    case 2:
      return 0.45;
    case 3:
      return 0.4;

    case 4:
      return 0.38;

    case 5:
      return 0.35;
    case 6:
      return 0.32;
    case 7:
      return 0.3;

    case 8:
      return 0.28;

    case 9:
      return 0.25;

    case 10:
      return 0.22;

    case 11:
      return 0.2;
    default:
      return 0;
  }
};
