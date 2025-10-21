import { ImageResponse } from "next/og";

export const size = {
   width: 512,
   height: 512,
};
export const contentType = "image/png";

export default function Icon() {
   return new ImageResponse(
      (
         <div
            style={{
               fontSize: 300,
               background: "black",
               color: "white",
               width: "100%",
               height: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
            }}
         >
            T
         </div>
      ),
      { ...size }
   );
}
