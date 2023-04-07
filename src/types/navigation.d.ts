import type { Receiver } from "../models/Receiver";

export type TMeasurement = {
  TOA: number;
  receiver: Receiver["pos"];
};

export type TTDOAMeasurement = {
  TDOA: number;
  receivers: Receiver["pos"][];
};
