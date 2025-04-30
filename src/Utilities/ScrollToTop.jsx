// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Define which routes should trigger scroll-to-top
    const routesToScroll = [
      "/",
      "/cart",
      "/admin",
    ];

    if (routesToScroll.includes(pathname)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
