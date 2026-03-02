export interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface EmbeddingResponse {
  embedding: number[];
}

export type GenerateRequest = {
  model: string;
  prompt: string;
  stream?: boolean;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  num_predict?: number;
};
