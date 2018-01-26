import * as React from 'react';
import * as Dialog from 'react-bootstrap-dialog';
import {ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

export let modalAppDialog: any = null;

class App extends React.Component<{ children: React.ReactNode }> {
  render() {
    return (
      <div className="app-root">
        <Dialog ref={(el: any) => {
          modalAppDialog = el;
        }}/>
        <ToastContainer
          style={{
            zIndex: 4000,
          }}
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={true}
          pauseOnHover={true}
        />
        {this.props.children}
      </div>);
  }
}

export default App;
