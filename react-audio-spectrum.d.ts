declare module "react-audio-spectrum" {
  interface MeterColor {
    stop: number;
    color: string;
  }

  interface AudioSpectrumProps {
    id?: string;
    width?: number;
    height?: number;
    audioId?: number | string;
    capColor?: string;
    capHeight?: number;
    meterWidth?: number;
    meterColor?: string | MeterColor[];
    gap?: number;
    audioEle?: HTMLAudioElement;
  }

  class AudioSpectrum extends React.Component<AudioSpectrumProps, any> {}

  export default AudioSpectrum;
}
