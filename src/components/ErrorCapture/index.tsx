import React from 'react';
import { Text, View } from 'react-native';

interface IProps {
  children: React.ReactNode;
}

interface IState {
  hasError: boolean;
}

class ErrorCapture extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log('Capture error: ', error, errorInfo);
    // console.log('Show stack: ', React.captureOwnerStack());

    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Encountered error</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorCapture;
