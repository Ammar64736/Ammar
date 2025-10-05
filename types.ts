
export interface CameraAngle {
  name: string;
  description: string;
}

export interface GeneratedImage {
  angle: string;
  src: string | null;
}

export interface HistoryItem {
  id: string;
  sourceImage: string;
  generatedImages: GeneratedImage[];
  timestamp: number;
}
