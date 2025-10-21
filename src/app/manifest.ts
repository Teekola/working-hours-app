import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
   return {
      name: "Teemun Tunnit",
      short_name: "Tunnit",
      start_url: "/",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      description: "Seuraa ja merkitse työtunnit helposti.",
   };
}
