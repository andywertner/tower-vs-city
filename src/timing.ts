export interface Timing {
  tower: number;
  city: number;
  collapse: number;
  read: number;
  flash: number;
}

export function timing(preview: boolean): Timing {
  if (preview) {
    return { tower: 450, city: 800, collapse: 450, read: 220, flash: 280 };
  }
  return { tower: 5000, city: 25000, collapse: 2800, read: 2600, flash: 1500 };
}

export function previewMode(): boolean {
  return typeof location !== "undefined" && location.hash.includes("preview");
}
