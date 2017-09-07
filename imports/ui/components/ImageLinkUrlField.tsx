import styled from 'styled-components';
import TextField from 'uniforms-bootstrap3/TextField';
import * as React from 'react';
import connectField from 'uniforms/connectField';

const ImageLinkUrl = class extends React.Component<any, {validImage: boolean}> {
  public state = {
    validImage: false,
  };

  public componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({validImage: false});
    }
  }

  public render() {
    return (
      <section className={this.props.className}>
        <TextField {...this.props} type="url" />
        <div className={this.state.validImage ? 'preview-image-area' : 'hidden-image-area'}>
          <img src={this.props.value} onError={this.imageError} onLoad={this.imageOkay} />
          <img className="image-okay-mark" src="/images/image-okay.png" />
        </div>
      </section>
    );
  }

  private imageError= () => {
    this.setState({validImage: false});
  }

  private imageOkay= () => {
    this.setState({validImage: true});
  }
};

const ImageLinkUrlField = connectField(ImageLinkUrl, {
  ensureValue: true,
  includeInChain: false,
  initialValue:   false,
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

    img {
      max-width: 400px;
      max-height: 400px;
    }

    .image-okay-mark {
      position: absolute;
      right: -10px;
      bottom: -10px;
    }
  }
`;
