import "./css/App.css";
import ColorModeSelect from "./themes/ColorModeSelect";

function App() {
  return (
    <>
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
    </>
  );
}

export default App;
