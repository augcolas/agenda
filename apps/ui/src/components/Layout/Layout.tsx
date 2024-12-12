import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Layout.css";
import { useAuth } from "../../contexts/AuthContext";
import Notifications from "../Notifications/Notifications";

export type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [page, setPage] = useState("");
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const path: string = location.pathname.split("/").join(" ");
    setPage(path);
  }, [location]);

  return (
    <div className={`mainLayout ${location.pathname === "/" ? "home" : page}`}>
      <header>
        <h1>
          <Link to="/">Agenda</Link>
        </h1>
        {isAuthenticated ? (
          <Fragment>
            <Notifications />
            <Link to="/logout">Déconnexion</Link>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </Fragment>
        )}
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 - Agenda</p>
      </footer>
    </div>
  );
};

export default Layout;
