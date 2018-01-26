import * as React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router';

import Toolbar from 'wheelmap-react/lib/components/Toolbar';
import SearchIcon from 'wheelmap-react/lib/components/SearchToolbar/SearchIcon';
import SearchInputField from 'wheelmap-react/lib/components/SearchToolbar/SearchInputField';

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
  searchBarPrefix?: string;
  searchBarLogo?: string;
  id?: string;
} & IStyledComponent;

type State = {
  sidePanelHidden?: boolean;
  isMobile?: boolean;
};


class NewMapLayout extends React.Component<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
    // aligned with wheelmap-react, but can this be css only?
    // todo listen to window size
    const isMobile = window.screen.availWidth <= 512 || window.screen.availHeight <= 512;
    console.log(isMobile, window.screen.availWidth, window.screen.width);

    this.state = {
      isMobile,
      sidePanelHidden: isMobile,
    };
  }

  toggleSidePanel = () => {
    this.setState({sidePanelHidden: !this.state.sidePanelHidden});
  };

  public render() {
    const {
      id, className, contentPanel, header, mapProperties, additionalMapPanel,
      forceSidePanelForMobile, searchBarPrefix, searchBarLogo,
    } = this.props;
    const {isMobile, sidePanelHidden} = this.state;

    const sidePanelOpen = !sidePanelHidden;

    // todo move to props
    const canDismissPanel = true;

    const useSidePanel = !isMobile || forceSidePanelForMobile;
    const useCardPanel = isMobile && !forceSidePanelForMobile;
    const useAdditionalCardPanel = !useCardPanel && (!isMobile || !sidePanelOpen);

    const displaySidePanel = contentPanel && useSidePanel && sidePanelOpen;
    const displayAnyCardPanel = (!isMobile || !useSidePanel || !sidePanelOpen);
    const displaySearchBar = (!isMobile || !displaySidePanel && !useCardPanel);

    return (
      <div id={id} className={`${className} map-layout ${isMobile ? 'overlap-side-panel' : 'fixed-side-panel' } `}>
        <section className={`side-panel ${displaySidePanel ? 'show-panel' : 'hide-panel'}`}>
          {header && <header>{header}</header>}
          {displaySidePanel && <section className="content">
            {canDismissPanel && <a className="dismiss-panel-button" onClick={this.toggleSidePanel}>«</a>}
            {contentPanel}
          </section>}
        </section>
        <section className="map" onTouchStart={displaySidePanel ? this.toggleSidePanel : undefined}>
          <Map {...mapProperties}/>
          {displaySearchBar &&
          <Toolbar className="search-toolbar"
                   isSwipeable={false}
                   minimalHeight={75}>
            <a onClick={this.toggleSidePanel}>
              {searchBarLogo &&
              <div className="small-logo" style={{backgroundImage: `url(${searchBarLogo})`}}/>}
              {(!searchBarLogo && searchBarPrefix) &&
              <h1>{searchBarPrefix}</h1>}
            </a>
            <div className="search-input">
              <SearchInputField/>
              <SearchIcon className="search-icon"/>
            </div>
          </Toolbar>}
          {contentPanel && useCardPanel && displayAnyCardPanel && <Toolbar className="card-panel">
            {contentPanel}
          </Toolbar>}
          {additionalMapPanel && useAdditionalCardPanel && displayAnyCardPanel && <Toolbar className="card-panel">
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
  
  .search-toolbar {
    // TODO bottom position comes from wheelmap beta
    transform: translate3d(0px, 0px, 0px) !important;
    top: 0px;
    left: 0;
    width: calc(100% - 70px);
    display: flex;
    
    .small-logo {
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
      background-color: ${colors.bgWhite};
      min-height: 32px;
      width: 50px;
      margin-right: 8px;
  
      a {
        text-overflow: ellipsis;
        display: block;
        overflow: hidden;
        white-space: nowrap;
      }      
    }
    
    h1 {
      position: relative;
      margin: 0;
      padding-right: 8px;
      font-size: 21px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 50px;
    }
    
    .search-input {
      position: relative;
      flex: 1;
    
      .search-icon {
        position: absolute;
        top: 8px;
        left: 6px;
        pointer-events: none;
      }
    }
  }
  
  // side panel for all configurations
  .side-panel {
    width:375px;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    
    header {
      background: ${colors.bgWhite};
      pointer-events: auto;
    }
    
    section.content {
      flex: 1;
      display: flex;
      background: ${colors.bgWhite};
      border-right: solid 1px ${colors.shadowGrey};
      overflow-y: auto;    
      position: relative;
      pointer-events: auto;
      
      .dismiss-panel-button {
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 32px;
        opacity: 0.35;
        color: black;
      }    
    }
    
    &.hide-panel {
      section.content {    
        display: none;
      } 
    }
  }
  
  // card panels for all configurations
  .card-panel {
    top: unset;
    bottom: 30px;
  }
  
  // desktop mode, side panel moves map to the right
  &.fixed-side-panel {
    flex-direction: row;
  
    .search-toolbar {
      position: absolute;
    }
     
    .card-panel {
      position: absolute;
    }
    
    .side-panel.hide-panel {
      width: 0;
      min-width: 0;
    }
  }
  
  // mobile mode, side panel overlaps map
  &.overlap-side-panel {
    flex-direction: row;
    
    .side-panel {
      position: fixed;
      z-index: 2000;
      height: 100%;
    }
    
    .hide-panel {
      header {    
        position: fixed;
        left: 0;
        right: 0;
      } 
    }
    
    .card-panel {
      // allow overlapping header if card is swiped up
      z-index: 3000;
    }
  }
  
  
  /** This normally includes the map-area on the right side. */
  .map {
    flex:1;
    position: relative;
    display: flex;
    overflow: hidden;
  }
  `;
