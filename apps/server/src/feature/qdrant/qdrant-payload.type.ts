/* eslint-disable @typescript-eslint/no-explicit-any */

export interface QdrantPoint {
  id: string | number;
  vector: number[];
  payload: Record<string, any>;
}

export interface QdrantSearchResult {
  id: string | number;
  score: number;
  payload: Record<string, any>;
}

export interface QdrantFilter {
  [key: string]: any;
}
