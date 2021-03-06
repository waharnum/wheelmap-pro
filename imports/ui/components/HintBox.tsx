import styled from 'styled-components';
import * as React from 'react';
import { colors } from '../stylesheets/colors';

import { IStyledComponent } from '../components/IStyledComponent';

interface IHintHeader {
  children: React.ReactNode;
}

const HintHeader = (props: IStyledComponent & IHintHeader) => {
  return (
    <h3 className={props.className || 'empty'}>{props.children}</h3>
  );
};

interface IHintProps {
  children: React.ReactNode;
}

export const Hint = (props: IStyledComponent & IHintProps) => {
  return (
    <li className={props.className || 'empty'}>{props.children}</li>
  );
};

interface IHintBoxProps {
  title?: string;
  headerClassName?: string;
  children: React.ReactNode;
}

const InternalHintBox = (props: IStyledComponent & IHintBoxProps) => {
  return (
    <div className={props.className + ' hint-box'}>
      <HintHeader className={props.headerClassName}>{props.title}</HintHeader>
      <ol className="hints">
        {props.children}
      </ol>
    </div>
  );
};

export const HintBox = styled(InternalHintBox) `
  flex-grow: 1;
  flex-basis: 100px;
  margin-left: 2em;
  padding-left: 2em;
  padding-bottom: 5em;
  border-left: 2px solid ${colors.bgGreyDarker};

  h3 {
    position: relative;
    padding-left: 2em;
    padding-bottom: 1em;
    font-size: 24px;
    line-height: 24px;
    font-weight: 300;
    color: ${colors.bgAnthracite};
    opacity: 0.8;

    :before {
      position: absolute;
      top: -5px;
      left: -5px;
      font-size: 24px;
      font-family: "iconfield-v03";
      font-size: 2em;
      color: ${colors.bgAnthracite};
      opacity: 0.5;
    }
  }

  h3.empty {
    padding-left: 0em;
  }

  ol {
    font-size: 16px;
    line-height: 26px;
    font-weight: 300;
    list-style: none;
    color: ${colors.bgAnthracite};
    
    li {
      position: relative;
      padding-bottom: 18px;
      line-height: 21px;
      padding-left: 2em;

      ::before {
        position: absolute;
        left: 7px;
        top: 0;
        font-family: "iconfield-v03";
        color: ${colors.bgAnthracite};
        opacity: 0.5;
      }

      li.empty {
        padding-left: 0em;
      }
    }

    .idea::before   { content: ''; }
    .done::before   { content: ''; }
    .user::before   { content: 'p';  }
    .group::before  { content: '∏'; }
    .map::before    { content: ''; }
    .info::before   { content: ''; }
    .rocket::before  { content: '¶'; }
    .cloud::before  { content: ''; }
    .share::before  { content: ''; }
  }

  @media only screen and (max-width: 580px) {
    margin-top: 2em;
    margin-left: 20px;
    padding-left: 0;
    border-left: none;
    border-top: 2px solid ${colors.bgGreyDarker};
  }
`;
