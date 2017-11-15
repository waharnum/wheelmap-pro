import * as React from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class App extends React.Component<{ children: React.ReactNode }> {
  render() {
    return (
      <div className="app-root">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        {this.props.children}
      </div>);
  }
}

export default App;
