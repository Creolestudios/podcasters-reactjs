export interface DragDropFileInterface {
  handleFile: (e: any) => void;
  icon: React.ReactNode;
  name?: string;
  accept: string;
  height: number;
  width: number;
  maxFileSize: number;
  sizeIn?: string;
  show?: boolean;
  disabled?: boolean;
  content?: string;
  subContent?: string;
  isAudio?: boolean;
  maxDuration?: number;
  handleDragDropStyle?: (value: boolean) => void;
}

export interface resizeImageInterface {
  handleFile: (e: any) => void;
  show: boolean;
  src: string;
  height: number;
  width: number;
  onHide: () => void;
}
