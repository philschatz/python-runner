import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

import * as Sk from 'skulpt'; // https://github.com/s-cork/sk-types

// output functions are configurable.  This one just appends some text
// to a pre element.
function outf(text) { 
  var mypre = document.getElementById("output"); 
  mypre.innerHTML = mypre.innerHTML + text; 
} 

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
      throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

// Set up Skulpt
Sk.configure({ output: outf, read: builtinRead });

const App: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const solution = `def add(a, b):
  return a + b

print(add(1, 2))`;

  const handleRunCode = () => {
    Sk.misceval.asyncToPromise(() => {
      return Sk.importMainWithBody('<stdin>', false, code, true);
    }).then(
      () => {
        setOutput('Code executed successfully');
      },
      (err: any) => {
        setOutput(err.toString());
      },
    );
  };

  return (
    <div className="App">
      <AceEditor
        mode="python"
        theme="monokai"
        onChange={(newCode) => setCode(newCode)}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{ width: '100%', minHeight: '300px' }}
      />
      <button onClick={handleRunCode}>Run</button>
      <pre>{output}</pre>
      {solution && (
        <>
          <button onClick={() => setShowSolution(!showSolution)}>
            {showSolution ? 'Hide' : 'Show'} Solution
          </button>
          <pre style={{ filter: showSolution ? 'none' : 'blur(5px)' }}>
            {solution}
          </pre>
        </>
      )}
    </div>
  );
};

export default App;