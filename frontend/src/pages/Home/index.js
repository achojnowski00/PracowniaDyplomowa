import "./style.scss";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="App">
      <main className="App-main">
        <p>Page 1</p>

        <div className="container">
          <div className="container-test"></div>
        </div>

        <Link to="/page2" className="App-link">
          Next Page
        </Link>
      </main>
    </div>
  );
}
