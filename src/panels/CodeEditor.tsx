
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import React from 'react';

export function CodeEditor() {
  const onChange = React.useCallback((value: string) => {
    console.log("value: ", value);
  }, []);
  return <div>
    <p>Currently editing </p>
     <CodeMirror
    value="ctx.fillText('Hello world!', width / 2, height / 2)"
    style={{
      height: "100%"
    }}
    extensions={[javascript()]}
    onChange={onChange}
  ></CodeMirror>
  </div>
}