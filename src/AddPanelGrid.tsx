import { useEffect } from "react"
import { IoCaretBack, IoCaretDown, IoCaretForward, IoCaretUp } from "react-icons/io5"
import { PanelDirection } from "./AppPanel"
import { Helpable } from "./panels/Common"

export function AddPanelGrid(props: {
    onExit: () => void
    onAddPanel: (direction: PanelDirection, positive: boolean) => void
  }) {
  
      useEffect(() => {
          const keydown = (e: KeyboardEvent) => {
              if (e.key == "ArrowUp") {
                  props.onAddPanel(PanelDirection.VERTICAL, false)
              } else if (e.key == "ArrowLeft") {
                  props.onAddPanel(PanelDirection.HORIZONTAL, false)
              } else if (e.key == "ArrowRight") {
                  props.onAddPanel(PanelDirection.HORIZONTAL, true)
              } else if (e.key == "ArrowDown") {
                  props.onAddPanel(PanelDirection.VERTICAL, true)
              } else if (e.key == "Escape") {
                props.onExit();
              }
          }
          document.addEventListener("keydown", keydown);
          return () => {
              document.removeEventListener("keydown", keydown);
          }
      })
  
    return <div 
      onMouseLeave={props.onExit}
    className="add-panel-container">
      <Helpable
          style={{
              gridColumnStart: 2,
              gridColumnEnd: 3
          }}
          message={<p>Click to add the new panel above the current one. You can also do this with the <kbd>Up Arrow</kbd> key.</p>}
      >
          <button
          className="add-panel-direction-button"
          onClick={() => props.onAddPanel(PanelDirection.VERTICAL, false)}
          ><IoCaretUp></IoCaretUp></button>
      </Helpable>
      <Helpable
          style={{
          gridColumnStart: 1,
          gridColumnEnd: 2,
          gridRowStart: 2,
          gridRowEnd: 3,
          }}
          message={<p>Click to add the new panel to the left of the current one. You can also do this with the <kbd>Left Arrow</kbd> key.</p>}
      >
      <button
          className="add-panel-direction-button"
        onClick={() => props.onAddPanel(PanelDirection.HORIZONTAL, false)}
      ><IoCaretBack></IoCaretBack></button>
      </Helpable>
      <Helpable
          style={{
          gridColumnStart: 3,
          gridColumnEnd: 4,
          gridRowStart: 2,
          gridRowEnd: 3,
          }}
          message={<p>Click to add the new panel to the right of the current one. You can also do this with the <kbd>Right Arrow</kbd> key.</p>}
      >
      <button
          className="add-panel-direction-button"
        onClick={() => props.onAddPanel(PanelDirection.HORIZONTAL, true)}
        ><IoCaretForward></IoCaretForward></button>
        </Helpable>
      <Helpable
          message={<p>Click to add the new panel below the current one. You can also do this with the <kbd>Down Arrow</kbd> key.</p>}
          style={{
              gridColumnStart: 2,
              gridColumnEnd: 3,
              gridRowStart: 3,
              gridRowEnd: 4,
          }}
      >
          <button
          className="add-panel-direction-button"
          onClick={() => props.onAddPanel(PanelDirection.VERTICAL, true)}
          ><IoCaretDown></IoCaretDown></button>
      </Helpable>
    </div>
  }
  