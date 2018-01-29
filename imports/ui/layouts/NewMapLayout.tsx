import * as React from 'react';
import styled from 'styled-components';

import Toolbar from 'wheelmap-react/lib/components/Toolbar';
import SearchIcon from 'wheelmap-react/lib/components/SearchToolbar/SearchIcon';
import SearchInputField from 'wheelmap-react/lib/components/SearchToolbar/SearchInputField';
import CloseIcon from 'wheelmap-react/lib/components/icons/actions/Close';

import {IStyledComponent} from '../components/IStyledComponent';

import Map, {Props as MapProps} from '../components/Map';
import {colors} from '../stylesheets/colors';

type Props = {
  header: React.ReactNode;
  contentPanel: React.ReactNode;
  additionalMapPanel?: React.ReactNode;
  mapChildren?: React.ReactNode;
  forceContentToSidePanel?: boolean;
  canCloseSidePanelOnDesktop?: boolean;
  mapProperties: MapProps;
  allowSearchBar?: boolean;
  searchBarPrefix?: string;
  searchBarLogo?: string;
  canDismissSidePanel?: boolean;
  canDismissCardPanel?: boolean;
  canDismissAdditionalCardPanel?: boolean;
  onSearchBarLogoClicked?: () => void;
  onDismissSidePanel?: () => void;
  onDismissCardPanel?: () => void;
  onDismissAdditionalCardPanel?: () => void;
  sidePanelHidden?: boolean;
  id?: string;
} & IStyledComponent;

type State = {
  preferContentInCard: boolean;
  initialSidePanelHidden: boolean;
};

class NewMapLayout extends React.Component<Props, State> {
  state: State = {
    preferContentInCard: true,
    initialSidePanelHidden: true,
  };

  constructor(props: Props) {
    super(props);
    // aligned with wheelmap-react, but can this be css only?
    // todo listen to window size
    const lowResolution = window.screen.availWidth <= 512 || window.screen.availHeight <= 512;

    this.state = {
      preferContentInCard: lowResolution,
      initialSidePanelHidden: lowResolution,
    };
  }

  componentWillReceiveProps(newProps: Props) {
    // sidePanel content has changed, but side-panel was hidden
    if (this.state.initialSidePanelHidden && !this.state.preferContentInCard &&
      newProps.contentPanel !== this.props.contentPanel) {
      this.setState({
        initialSidePanelHidden: false,
      });
    }
  }

  dismissAdditionalCardPanel = () => {
    if (this.props.canDismissAdditionalCardPanel && this.props.onDismissAdditionalCardPanel) {
      this.props.onDismissAdditionalCardPanel();
    }
  };

  dismissCardPanel = () => {
    if (this.props.canDismissCardPanel && this.props.onDismissCardPanel) {
      this.props.onDismissCardPanel();
    }
  };

  dismissSidePanel = () => {
    if (this.props.canDismissSidePanel && this.props.onDismissSidePanel) {
      this.props.onDismissSidePanel();
    }
  };

  searchBarLogoClicked = () => {
    if (this.props.onSearchBarLogoClicked) {
      this.props.onSearchBarLogoClicked();
    }
  };

  public render() {
    const {
      id, className, contentPanel, header, mapProperties, additionalMapPanel, allowSearchBar,
      forceContentToSidePanel, searchBarPrefix, searchBarLogo, canDismissSidePanel, mapChildren,
      sidePanelHidden, canDismissAdditionalCardPanel, canDismissCardPanel, onSearchBarLogoClicked,
    } = this.props;
    const {preferContentInCard, initialSidePanelHidden} = this.state;


    const effectiveSidePanelHidden = sidePanelHidden === undefined ? initialSidePanelHidden : sidePanelHidden;
    const useSidePanel = !preferContentInCard || forceContentToSidePanel;
    const useCardPanel = preferContentInCard && !forceContentToSidePanel;
    const useAdditionalCardPanel = !useCardPanel && (!preferContentInCard || effectiveSidePanelHidden);

    const displayAnyCardPanel = (!preferContentInCard || !useSidePanel || effectiveSidePanelHidden);
    const displayCardPanel = contentPanel && useCardPanel && displayAnyCardPanel;
    const displaySidePanel = contentPanel && useSidePanel && !effectiveSidePanelHidden;
    const displayAdditionalCardPanel = additionalMapPanel && useAdditionalCardPanel && displayAnyCardPanel;
    const displaySearchBar = (preferContentInCard ? !(displaySidePanel || displayCardPanel) : true) && allowSearchBar;

    return (
      <div id={id}
           className={`${className} map-layout ${preferContentInCard ? 'overlap-side-panel' : 'fixed-side-panel' } `}>
        <section className={`side-panel ${displaySidePanel ? 'show-panel' : 'hide-panel'}`}>
          {header && <header>{header}</header>}
          {displaySidePanel && <section className="content">
            {canDismissSidePanel && <a className="dismiss-panel-button" onClick={this.dismissSidePanel}>«</a>}
            {contentPanel}
          </section>}
        </section>
        <section className="map" onTouchStart={displaySidePanel ? this.dismissSidePanel : undefined}>
          <Map {...mapProperties}>
            {mapChildren}
          </Map>
          {displaySearchBar &&
          <Toolbar className="search-toolbar"
                   isSwipeable={false}
                   minimalHeight={75}>
            <a onClick={this.searchBarLogoClicked}
               className={onSearchBarLogoClicked ? 'organization-logo' : 'organization-logo disabled'}>
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
          {displayCardPanel && <Toolbar className="card-panel">
            {canDismissCardPanel && <a className="close-icon" onClick={this.dismissCardPanel}>
              <CloseIcon/>
            </a>}
            {contentPanel}
          </Toolbar>}
          {displayAdditionalCardPanel &&
          <Toolbar className="card-panel additional-card-panel">
            {canDismissAdditionalCardPanel && <a className="close-icon" onClick={this.dismissAdditionalCardPanel}>
              <CloseIcon/>
            </a>}
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
    top: 0;
    left: 0;
    display: flex;
    
    a.organization-logo {
      cursor: pointer;
      
      .small-logo {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
        background-color: ${colors.bgWhite};
        min-height: 32px;
        width: 50px;
        margin-right: 8px;
      }
  
      h1 {
        text-overflow: ellipsis;
        display: block;
        overflow: hidden;
        white-space: nowrap;
      }
      
      &:hover {
       .small-logo, h1 {
          background-color: ${colors.linkBlue};
       }
      }
      
      &.disabled {
        pointer-events: none;
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
  
  .card-panel {
    // only pad to the top, needed to show slide indicator
    padding: 12px 0 0 0;
    min-height: 120px;
    
    .close-icon {
      display: block;
      position: absolute;
      padding: 6px 8px 0 0;
      color: rgba(0,0,0,0.3);
      text-decoration: none;
      text-align: center;
      z-index: 1;
      top: 0px;
      right: 0px;
      pointer-events: all;
      cursor: pointer;
    }
  }
  
  // side panel for all configurations
  .side-panel {
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
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 32px;
        opacity: 0.35;
        color: black;
        user-select: none;
        
        &:hover {
          opacity: 1.0;
        }
      }    
    }
    
    &.hide-panel {
      section.content {    
        display: none;
      } 
    }
  }
    
  // desktop mode, side panel moves map to the right
  &.fixed-side-panel {
    flex-direction: row;
  
    .search-toolbar {
      position: absolute;
    }
     
    .card-panel {
      position: absolute; 
      top: unset;
      bottom: 30px;
    }
    
    .side-panel {
      width:375px;
      
      &.hide-panel {
        width: 0;
        min-width: 0;
      }
    }
    
    // remove hard coded toolbar size
    .toolbar {
      width: unset;
      max-width: 500px;
    }
  }
  
  // mobile mode, side panel overlaps map
  &.overlap-side-panel {
    flex-direction: row;
    
    .search-toolbar {    
      max-width: calc(100% - 70px);
    }
    
    .side-panel {
      position: fixed;
      z-index: 2000;
      height: 100%;
      max-width: calc(100% - 70px);
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
