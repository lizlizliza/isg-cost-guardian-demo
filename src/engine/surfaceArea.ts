import type { ComponentParams } from "../types";

export function calcSurfaceArea(params: ComponentParams, componentId: string): number {
  const l = params.length / 10;
  const w = params.width / 10;

  if (componentId === "air-baffle") {
    return l * w * 2 + l * (params.thickness / 10) * 2
      + params.extraDim1 * l * (params.thickness / 10) * 0.6;
  }

  if (componentId === "top-cover") {
    const cutoutFactor = 1 - params.extraDim1 / 100;
    return l * w * cutoutFactor * 2;
  }

  const d = params.extraDim1 / 10; // depth in cm
  return (l * w + l * d + w * d) * 2 * 0.7;
}
