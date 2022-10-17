import { useState } from 'react'
import { useAppStore } from './app-state/StateManager';
import './App.css'
import { AppPanel, Panel, PanelDirection, PanelType } from './AppPanel';
import { HelpNotifier } from './HelpNotifier';
import { SinglePanelType } from './SingleAppPanel';

function App() {
  const [data, setData] = useState<Panel>({
    type: PanelType.MULTIPLE,
    direction: PanelDirection.VERTICAL,
    children: [
      {
        type: PanelType.MULTIPLE,
        key: "0",
        size: 400,
        direction: PanelDirection.HORIZONTAL,
        children: [
          {
            type: PanelType.SINGLE,
            key: "0",
            panel: { type: SinglePanelType.FILE_EXPLORER },
            size: 200
          },
          {
            type: PanelType.SINGLE,
            key: "1",
            panel: { type: SinglePanelType.DISPLAY },
            size: 200
          },
          {
            type: PanelType.SINGLE,
            key: "2",
            panel: { type: SinglePanelType.FILE_EDITOR },
            size: 200
          },
        ]
      },

      {
        type: PanelType.MULTIPLE,
        key: "0",
        size: 400,
        direction: PanelDirection.HORIZONTAL,
        children: [
          {
            type: PanelType.SINGLE,
            key: "6",
            panel: { type: SinglePanelType.FILE_EDITOR },
            size: 200
          },
          {
            type: PanelType.SINGLE,
            key: "7",
            panel: { type: SinglePanelType.CLIP_EDITOR },
            size: 200
          },
        ]
      },
    ],
    size: 600,
    key: "0"
  })


  return (
    <div className="App">
      <HelpNotifier></HelpNotifier>
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
