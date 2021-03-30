import { StrictMode } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { createStore } from "../src/polar";

const useGlobalState = createStore(
  {
    reset: (s) => {
      return { num: 0 };
    },
    increment: (s) => {
      return { ...s, num: (s.num += 1) };
    },
    decrement: (s) => {
      return { ...s, num: (s.num -= 1) };
    }
  },
  { num: 0 }
);

export default function App() {
  const { num, increment } = useGlobalState();

  return (
    <div className="App">
      <h1 onClick={increment}>{num}</h1>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
