import * as React from 'react';

class App extends React.Component<{ children: React.ReactNode }> {
  render() {
    return (
      <div className="app-root">
        {this.props.children}
      </div>);
  }
}

export default App;
