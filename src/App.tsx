import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Provider } from 'react-redux';
import store from "./Store";
import './App.css'
import { AppPanel, Panel, PanelDirection, PanelType } from './AppPanel';

function App() {
  const [count, setCount] = useState(0)

  const [data, setData] = useState<Panel>({
    type: PanelType.MULTIPLE,
    direction: PanelDirection.HORIZONTAL,
    children: [
      { type: PanelType.CODE_EDITOR, key: "1", size: 1  },
      {
        type: PanelType.MULTIPLE,
        direction: PanelDirection.VERTICAL,
        children: [
          { type: PanelType.CODE_EDITOR, key: "1", size: 1  },
          { type: PanelType.CODE_EDITOR, key: "2", size: 1  },
          { type: PanelType.CODE_EDITOR, key: "3", size: 1  },
        ],
        key: "0",
        size: 1 
      },
      { type: PanelType.CODE_EDITOR, key: "3", size: 1 },
    ],
    size: 1,
    key: "0"
  })

  return (
    <Provider store={store}>
      <div className="App">
        <AppPanel
          data={data}
          setData={setData}
          direction={PanelDirection.VERTICAL}
        ></AppPanel>
      </div>
    </Provider>
  )
}

export default App
