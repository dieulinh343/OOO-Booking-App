import { ColorList } from '../constants/color';

export const getColor = (number: string, colorList = ColorList): string | null => {
  if (!colorList) return null;

  let index = 0;
  if (typeof number === 'number') {
    index = number % colorList.length;
  }

  return colorList[index];
};

export const pickUniqueColor = (usedColors: string[], colorList = ColorList): string => {
  let index = 0;
  if (usedColors.length < colorList.length) {
    do {
      if (!usedColors.includes(colorList[index])) {
        return colorList[index];
      }
      index++;
    }
    while (index < colorList.length);
  }
  index = usedColors.length % colorList.length;
  return colorList[index];
};

export default {
  getColor,
  pickUniqueColor,
};
