import React from "react";
import { Rnd } from "react-rnd";
import { useWindowLayout } from "./useWindowLayout";
import { useWindowManager, Z_BASE } from "./WindowManagerContext";

const MINIMIZED_HEIGHT = 40;

interface WindowFrameProps {
  id: string;
  title: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  resizable?: boolean;
  /** If set, minimizing hides the window entirely in favor of a small fixed pill with this label. */
  minimizedPillLabel?: string;
  baseZIndex?: number;
  /** If set, a close (X) button is shown alongside minimize. */
  onClose?: () => void;
  children: React.ReactNode;
}

export default function WindowFrame({
  id,
  title,
  defaultPosition,
  defaultSize,
  resizable = true,
  minimizedPillLabel,
  baseZIndex = Z_BASE,
  onClose,
  children,
}: WindowFrameProps) {
  const [layout, setLayout] = useWindowLayout(id, defaultPosition, defaultSize);
  const { zIndexOf, focus, isFocused, isMinimized, toggleMinimize } = useWindowManager();
  const minimized = isMinimized(id);
  const focused = isFocused(id);
  const zIndex = zIndexOf(id, baseZIndex);

  if (minimized && minimizedPillLabel) {
    return (
      <button
        type="button"
        className="window-pill"
        style={{ zIndex }}
        onClick={() => {
          focus(id);
          toggleMinimize(id);
        }}
      >
        {minimizedPillLabel}
      </button>
    );
  }

  return (
    <Rnd
      size={{ width: layout.width, height: minimized ? MINIMIZED_HEIGHT : layout.height }}
      position={{ x: layout.x, y: layout.y }}
      onDragStart={() => focus(id)}
      onResizeStart={() => focus(id)}
      onMouseDown={() => focus(id)}
      onDragStop={(_event, data) => setLayout({ ...layout, x: data.x, y: data.y })}
      onResizeStop={(_event, _direction, ref, _delta, position) =>
        setLayout({
          x: position.x,
          y: position.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        })
      }
      dragHandleClassName="window-titlebar"
      enableResizing={resizable && !minimized}
      bounds="parent"
      minWidth={220}
      minHeight={minimized ? MINIMIZED_HEIGHT : 120}
      // react-rnd's own default inline style sets display:"inline-block",
      // which (being inline) overrides .window-frame's `display: flex` from
      // styles.scss -- without re-asserting it here the titlebar/body flex
      // layout never actually applies, so .window-body's flex:1 + overflow:
      // auto do nothing and tall content silently gets clipped instead of
      // scrolling.
      style={{ zIndex, display: "flex", flexDirection: "column" }}
      className={`window-frame${focused ? " window-frame--focused" : ""}`}
    >
      <div className="window-titlebar">
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button
            type="button"
            className="window-minimize-btn"
            onClick={(event) => {
              event.stopPropagation();
              toggleMinimize(id);
            }}
            aria-label={minimized ? "Restore window" : "Minimize window"}
          >
            {minimized ? "▢" : "—"}
          </button>
          {onClose && (
            <button
              type="button"
              className="window-close-btn"
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              aria-label="Close window"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {!minimized && <div className="window-body">{children}</div>}
    </Rnd>
  );
}
