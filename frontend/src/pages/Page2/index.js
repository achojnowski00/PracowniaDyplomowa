import "./style.scss";
import { Link } from "react-router-dom";
import MovingIcon from "@mui/icons-material/Moving";

export function PageTwo() {
  return (
    <div className="App">
      <main className="App-main">
        <p>
          Page 2
          <MovingIcon />
        </p>

        <Link to="/" className="App-link">
          Previous Page
        </Link>
      </main>
    </div>
  );
}
