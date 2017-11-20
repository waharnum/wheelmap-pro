declare module 'react-bootstrap-dialog' {
  import * as React from 'react';

  type DialogProps = {
    ref: (instance: DialogStatic) => void
  }

  type DialogAction = {};

  interface DialogStatic extends React.StatelessComponent<DialogProps> {
    show(options: {
      title: string;
      body: string;
      actions?: DialogAction[];
      bsSize?: string;
      onHide?: (dialog: DialogStatic) => void
    });

    hide();

    showAlert(body, bsSize?: string);

    setOptions(options: {
      defaultOkLabel: string,
      defaultCancelLabel: string,
      primaryClassName: string,
    });

    CancelAction: (func?: (dialog: DialogStatic) => void) => DialogAction;
    OKAction: (func?: (dialog: DialogStatic) => void) => DialogAction;
    Action: (label: string, func?: (dialog: DialogStatic) => void, className?: string) => DialogAction;
    DefaultAction: (label: string, func?: (dialog: DialogStatic) => void, className?: string) => DialogAction;
  }

  const Dialog: DialogStatic
  export = Dialog;
}
