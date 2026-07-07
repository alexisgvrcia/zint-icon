export interface GradientStop {
  color: string;
  position: number;
}

export interface MeshGradientColor {
  id: string;
  color: string;
  x: number;
  y: number;
}

export interface ProcessedSvgOptions {
  iconGlow: boolean;
  iconGlass: boolean;
  iconColor: string;
  iconSize: number;
  iconOffsetX: number;
  iconOffsetY: number;
}
