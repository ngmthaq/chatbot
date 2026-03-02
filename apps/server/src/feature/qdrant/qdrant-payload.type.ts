export interface QdrantPoint {
  id: string;
  vector: number[];
  payload: Record<string, any>;
}

export interface QdrantSearchResult {
  id: string;
  score: number;
  payload: Record<string, any>;
}

export interface QdrantFilter {
  [key: string]: any;
}
