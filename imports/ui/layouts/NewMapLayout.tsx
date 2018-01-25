import * as React from 'react';
import styled from 'styled-components';

import {IStyledComponent} from '../components/IStyledComponent';

import Map, {Props as MapProps} from '../components/Map';
import {colors} from '../stylesheets/colors';

type Props = {
  header: React.ReactNode;
  contentPanel: React.ReactNode;
  // layoutMode: 'contentInSidePanel' | 'contentInCardPanel';
  mapProperties: MapProps;
  id?: string;
};

class NewMapLayout extends React.Component<IStyledComponent & Props> {

  public render() {
    const {id, className, contentPanel, header, mapProperties} = this.props;

    return (
      <div id={id} className={className + ' map-layout'}>
        <section className="side-panel">
          {header && <header>{header}</header>}
          {contentPanel && <section className="content">{contentPanel}</section>}
        </section>
        <section className="map">
          <Map {...mapProperties} />
        </section>
      </div>
    );
  }
};

export default styled(NewMapLayout) `
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  
  .side-panel {
    width:375px;
    display: flex;
    flex-direction: column;
    
    header {
      background: ${colors.bgWhite}
    }
    
    section.content {
      flex: 1;
      display: flex;
      background: ${colors.bgWhite}
    }
  }

  /** This normally includes the map-area on the right side. */
  .map {
    flex:1;
    position: relative;
    
    justify-content: center;
    align-content: center;
    display: flex;
    overflow: hidden;
  }
  `;
