
declare module 'react-clipboard.js' {
  import { ComponentClass, CSSProperties, HTMLProps } from "react";

  export interface ClipboardButtonProps  {
    className: string;
    dataClipboardText: string;
  }
  const ClipboardButton: ComponentClass<ClipboardButtonProps>;
  
  export default ClipboardButton;
}

