import { useState } from 'react'
import './App.css'
import { AppPanel, Panel, PanelDirection, PanelType } from './AppPanel';
import { SinglePanelType } from './SingleAppPanel';

function App() {
  const [data, setData] = useState<Panel>({
    type: PanelType.MULTIPLE,
    direction: PanelDirection.HORIZONTAL,
    children: [{
      type: PanelType.SINGLE,
      key: "0",
      panel: { type: SinglePanelType.UNDECIDED },
      size: 600
    }],
    size: 600,
    key: "0"
  })

  return (
    <div className="App">
      <AppPanel
        outerStyle={{
          height: "calc(100vh - 20px)",
          width: "calc(100vw - 18px)"
        }}
        onResize={delta => {
          setData({
            ...data,
            size: data.size + delta
          });
        }}
        data={data}
        setData={setData}
        direction={PanelDirection.VERTICAL}
      ></AppPanel>
    </div>
  )
}

export default App
