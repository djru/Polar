import "./styles.css";
import { useEffect, useState } from "react";

const createStore = (r, s) => {
  // will hold all the set functions from all useStates
  const subs = {};

  // create a symbol and store the fn in the object
  const subscribe = (fn) => {
    let sym = Symbol();
    subs[sym] = fn;
    return () => {
      delete subs[sym];
    };
  };

  // map val over all functions in subs
  const dispatch = (val) => {
    for (const sym of Object.getOwnPropertySymbols(subs)) {
      const fn = subs[sym];
      fn(val);
    }
  };

  // state, getters and setters
  let state = s;
  const get = () => state;
  const set = (newState) => {
    state = newState;
    dispatch(state);
  };

  // we want to make it easy to pass a reducer as a simple function
  // but underneath it needs to call set()
  // so wrap each reducer in a function that calls it
  const reducers = r;
  for (const [k, v] of Object.entries(reducers)) {
    reducers[k] = (...args) => {
      const newState = v(state, ...args);
      // we assume that the result of the reducer is a partial result
      // and apply it to the existing state
      set({ ...state, ...newState });
    };
  }

  // this is the actual hook that will be called in the component
  const useHook = () => {
    // retreive the global state and copy it to the local state
    const receivedState = get();
    const [localState, setLocalState] = useState(receivedState);

    // subscribe so that local state is set to be the global state
    // whenever global state is updated (aka set() is called)
    useEffect(() => {
      const unsubscribe = subscribe(setLocalState);
      // unsub the function if component unmounts
      return unsubscribe;
    }, []);

    // just return everything in one object
    return { ...localState, ...reducers };
  };
  return useHook;
};

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
