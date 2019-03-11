export interface Data {
  stt: Status;
  gps?: GPS;
  ori?: Orientation;
  gf?: GForce;
  in?: Input;
  tmp?: number;
  psr?: number;
}

export interface GPS {
  lat: number;
  lng: number;
  alt: number;
  spd: number;
  new: number;
}

export interface Orientation {
  p: number;
  r: number;
  y: number;
}

export interface GForce {
  gx: number;
  gy: number;
  gz: number;
}

export interface Input {
  i0?: number;
  i1?: number;
  i2?: number;
  i3?: number;
  i4?: number;
  i5?: number;
  i6?: number;
  i7?: number;
  i8?: number;
  i9?: number;
}

export interface Status {
  log?: boolean;
  gps?: boolean;
  ori?: boolean;
  gf?: boolean;
  tmp?: boolean;
  psr?: boolean;
  i0?: boolean;
  i1?: boolean;
  i2?: boolean;
  i3?: boolean;
  i4?: boolean;
  i5?: boolean;
  i6?: boolean;
  i7?: boolean;
  i8?: boolean;
  i9?: number;
}
