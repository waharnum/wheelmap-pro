import styled from 'styled-components';
import {TextField} from 'uniforms-bootstrap3';
import * as React from 'react';
import connectField from 'uniforms/connectField';
import {debounce} from 'lodash';

class ImageLinkUrl extends React.Component<any, { validImage: boolean, proposedUrl?: string }> {
  public state = {
    validImage: false,
    proposedUrl: undefined,
  };
  private image: HTMLImageElement | null;

  constructor(props) {
    super(props);
    const {value} = props;
    this.state.proposedUrl = value;
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.proposedUrl) {
      this.setState({validImage: false, proposedUrl: nextProps.value});
    }
  }

  public render() {
    // strip away properties
    const {className, ...remainingProps} = this.props;

    return (
      <div className={'field form-group ' + className}>
        <TextField {...remainingProps}
                   onChange={this.onInputChanged}
                   value={this.state.proposedUrl} type="url"/>
        <div className={this.state.validImage ? 'preview-image-area' : 'hidden-image-area'}>
          <img ref={(ref) => this.image = ref} onError={this.imageError} onLoad={this.imageOkay}/>
          <img className="image-okay-mark" src="/images/image-okay.png"/>
        </div>
      </div>
    );
  }

  private onInputChanged = (value) => {
    this.setState({proposedUrl: value});
    this.inputDebounced(value);
  };

  private inputDebounced = debounce((value: string) => {
    if (this.image)
      this.image.src = value;
  }, 100);

  private imageError = () => {
    if (!this.image)
      return;
    this.setState({validImage: false});
    this.props.onChange(this.state.proposedUrl);
  };

  private imageOkay = () => {
    if (!this.image)
      return;
    this.setState({validImage: true});
    this.props.onChange(this.image.src);
  };
};

const ImageLinkUrlField = connectField(ImageLinkUrl, {
  ensureValue: true,
  includeInChain: false,
  initialValue: false,
});

export default styled(ImageLinkUrlField) `
  .hidden-image-area {
    display: none;
  }

  .preview-image-area {
    background: repeat url(/images/image-background.png);
    box-shadow: 0 0 7px 1px rgba(0,0,0,0.4);
    margin-left: 30px;
    position: relative;
    max-width: 400px;

    img {
      max-width: 100%;
      max-height: 400px;
    }

    .image-okay-mark {
      position: absolute;
      right: -10px;
      bottom: -10px;
    }
  }
`;
