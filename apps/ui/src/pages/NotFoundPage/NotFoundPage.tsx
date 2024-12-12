import { Link } from "react-router-dom";

import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>Page introuvable</p>
      <Link to="/">Retour à l&aposaccueil</Link>
    </div>
  );
};

export default NotFoundPage;
