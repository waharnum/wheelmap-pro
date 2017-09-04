import * as moment from 'moment';
import * as React from 'react';

export const  withTime = (WrappedComponent, interval: number = 1000) => {
  return class extends React.Component<any, {now: moment.Moment}> {
    public state = {
      now: moment(),
    };

    private intervalId;

    public render() {
      return <WrappedComponent moment={this.state.now} {...this.props} />;
    }

    public componentDidMount() {
      this.setState({ now: moment() });
      // TODO: switch to ONE static interval
      this.intervalId = setInterval(this.tick, interval);
    }

    public componentWillUnmount() {
      clearInterval(this.intervalId);
    }

    private tick = () => {
      this.setState({now: moment()});
    }
  };
};

// We need two exports to count as a module
export const foo = 1;
