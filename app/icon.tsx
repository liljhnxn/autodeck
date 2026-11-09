import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "linear-gradient(135deg, #FF6B35 0%, #FF5212 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          color: "white",
          boxShadow: "0 0 10px rgba(255,107,53,0.5)",
        }}
      >
        🏎️
      </div>
    ),
    {
      ...size,
    }
  );
}

