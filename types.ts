
export interface TranslationRecord {
  id: string;
  sourceText: string;
  translatedText: string;
  timestamp: number;
}

export enum TranslationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
