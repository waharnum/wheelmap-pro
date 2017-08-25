import * as React from 'react';

const Task = (props) => (
  <li className="task">
    {props.task.text}
  </li>
);

export default Task;
