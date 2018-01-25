import * as React from 'react';
import styled from 'styled-components';

import Toolbar from 'wheelmap-react/lib/components/Toolbar';

import {IStyledComponent} from '../components/IStyledComponent';

import Map, {Props as MapProps} from '../components/Map';
import {colors} from '../stylesheets/colors';

type Props = {
  header: React.ReactNode;
  contentPanel: React.ReactNode;
  additionalMapPanel?: React.ReactNode;
  forceSidePanelForMobile?: boolean;
  canCloseSidePanelOnDesktop?: boolean;
  mapProperties: MapProps;
  id?: string;
};

class NewMapLayout extends React.Component<IStyledComponent & Props> {

  public render() {
    const {id, className, contentPanel, header, mapProperties, additionalMapPanel, forceSidePanelForMobile} = this.props;

    // aligned with wheelmap-react
    const isMobile = window.screen.availWidth <= 512;
    const sidePanelOpen = !isMobile; // TODO use state

    // todo listen to window size
    console.log(isMobile, window.screen.availWidth, window.screen.width);

    const useSidePanel = !isMobile || forceSidePanelForMobile;
    const useCardPanel = isMobile && !forceSidePanelForMobile;
    const useAdditionalMapPanel = !useCardPanel && (!isMobile || !sidePanelOpen);

    const displaySidePanel = contentPanel && useSidePanel && sidePanelOpen;

    return (
      <div id={id} className={`${className} map-layout ${displaySidePanel ? 'with-side-panel' : '' }`}>
        <section className="side-panel">
          {header && <header>{header}</header>}
          {displaySidePanel && <section className="content">
            {contentPanel}
          </section>}
        </section>
        <section className="map">
          <Map {...mapProperties} />
          {contentPanel && useCardPanel && <Toolbar className="card-panel">
            {contentPanel}
          </Toolbar>}
          {additionalMapPanel && useAdditionalMapPanel && <Toolbar className="card-panel">
            {additionalMapPanel}
          </Toolbar>}
        </section>
      </div>
    );
  }
};

export default styled(NewMapLayout) `
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  
  .side-panel {
    header {
      background: ${colors.bgWhite}
    }
  }
  
  &.with-side-panel {
    flex-direction: row;
  
    .side-panel {
      width:375px;
      display: flex;
      flex-direction: column;
     
      section.content {
        flex: 1;
        display: flex;
        background: ${colors.bgWhite}
      }
    }
    .card-panel {
      position: absolute;
      top: unset;
      bottom: 30px;
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
