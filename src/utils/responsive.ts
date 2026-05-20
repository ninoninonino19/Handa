import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DESIGN_WIDTH = 390;   // iPhone 12/13/14 width
const DESIGN_HEIGHT = 844;  // iPhone 12/13/14 height

export const scale = (size: number): number => (screenWidth / DESIGN_WIDTH) * size;
export const verticalScale = (size: number): number => (screenHeight / DESIGN_HEIGHT) * size;
export const moderateScale = (size: number, factor = 0.5): number => size + (scale(size) - size) * factor;
export const getScreenWidth = () => screenWidth;
export const getScreenHeight = () => screenHeight;