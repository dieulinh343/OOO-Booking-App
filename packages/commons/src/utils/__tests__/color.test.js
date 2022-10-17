import { ColorList } from '../../constants/color';
import { default as color } from '../color';

describe('utils/color', () => {
  it('should be able to execute getColor successfully', () => {
    const numberOfColors = ColorList.length;
    expect(color.getColor(0)).toEqual(ColorList[0]);
    expect(color.getColor(1)).toEqual(ColorList[1]);
    expect(color.getColor(numberOfColors)).toEqual(ColorList[0]);
    expect(color.getColor(numberOfColors + 1)).toEqual(ColorList[1]);
    expect(color.getColor('a')).toEqual(ColorList[0]);
  });

  it('should be able to execute pickUniqueColor successfully', () => {
    const colorList = [ColorList[0], ColorList[1], ColorList[2]];
    expect(color.pickUniqueColor([ColorList[1]], colorList)).toEqual(ColorList[0]);
    expect(color.pickUniqueColor([ColorList[0], ColorList[1]], colorList)).toEqual(ColorList[2]);
    expect(color.pickUniqueColor([ColorList[0], ColorList[1], colorList[2]], colorList)).toEqual(ColorList[0]);
    expect(color.pickUniqueColor([ColorList[0], ColorList[1], colorList[2]])).toEqual(ColorList[3]);
  });
});
