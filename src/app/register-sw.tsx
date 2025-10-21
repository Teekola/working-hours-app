"use client";

import { useEffect } from "react";

export default function RegisterSW() {
   useEffect(() => {
      if ("serviceWorker" in navigator && window.location.protocol === "https:") {
         navigator.serviceWorker.register("/sw.js").catch(console.error);
      }
   }, []);
   return null;
}
