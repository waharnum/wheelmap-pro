import styled from 'styled-components';
import * as React from 'react';

import { IStyledComponent } from '../components/IStyledComponent';
interface IHintHeader {
  children: JSX.Element | string | Array<JSX.Element | string | null> | null | undefined;
}

const HintHeader = (props: IStyledComponent & IHintHeader) => {
  return (
    <h3 className={props.className || 'empty'}>{props.children}</h3>
  );
};

interface IHintProps {
  children: JSX.Element | string | Array<JSX.Element | string | null> | null | undefined;
}

export const Hint = (props: IStyledComponent & IHintProps) => {
  return (
    <li className={props.className || 'empty'}>{props.children}</li>
  );
};

interface IHintBoxProps {
  title?: string;
  headerClassName?: string;
  children: JSX.Element | string | Array<JSX.Element | string | null> | null | undefined;
}

const InternalHintBox = (props: IStyledComponent & IHintBoxProps) => {
  return (
    <div className={props.className + ' hint-box'} >
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

  h3 {
    position: relative;
    padding-left: 2em;
    padding-bottom: 1em;
    font-size: 20px;
    line-height: 24px;
    font-weight: 300;

    :before {
      position: absolute;
      top: -5px;
      left: -5px;
      font-size: 24px;
      font-family: "iconfield-v03";
      font-size: 2em;
      color: #c7cdd9;
    }
  }

  h3.empty {
    padding-left: 0em;
  }

  ol {
    font-size: 18px;
    line-height: 26px;
    font-weight: 300;
    list-style: none;

    li {
      position: relative;
      padding-bottom: 18px;
      line-height: 21px;
      padding-left: 2em;

      ::before {
        position: absolute;
        left: 7px;
        top: 0;
        color: #767e8a;
        font-family: "iconfield-v03";
      }

      li.empty {
        padding-left: 0em;
      }
    }

    .idea::before {
      content: '';
    }
    .user::before {
      content: 'p';
    }
    .group::before {
      content: '∏';
    }
    .map::before {
      content: '';
    }
    .info::before {
      content: '';
    }
    .rocket::before {
      content: '';
    }
  }
`;
