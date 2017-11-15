declare module 'react-clipboard.js' {
  import * as React from 'react';

  type ClipboardButtonProps = {
    className?: string;
    'data-clipboard-text'?: string;
    'option-text'?: () => string;
    onSuccess?: () => void;
    component?: React.ReactNode
  }

  interface ClipboardButtonStatic extends React.StatelessComponent<ClipboardButtonProps> {
  }

  const ClipboardButton: ClipboardButtonStatic
  export default ClipboardButton;
}
