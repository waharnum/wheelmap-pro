import * as moment from 'moment';
import * as React from 'react';

// Helper types
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Minus<T, U> = Pick<T, Diff<keyof T, keyof U>>;

type MomentProps = { now: moment.Moment };
type ResultProps<P> = Minus<P, MomentProps>;

export function withTime<P>(WrappedComponent: React.StatelessComponent<P & MomentProps>,
                            interval: number = 1000): React.ComponentClass<ResultProps<P>> {
  return class extends React.Component<ResultProps<P>, { now: moment.Moment }> {
    public state = {
      now: moment(),
    };

    private intervalId;

    public render() {
      return <WrappedComponent now={this.state.now} {...this.props} />;
    }

    public componentDidMount() {
      this.setState({now: moment()});
      // TODO: switch to ONE static interval
      this.intervalId = setInterval(this.tick, interval);
    }

    public componentWillUnmount() {
      clearInterval(this.intervalId);
    }

    private tick = () => {
      this.setState({now: moment()});
    };
  };
}
