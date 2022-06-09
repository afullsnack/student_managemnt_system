const dev = process.env.NODE_ENV !== "production";

export const url = dev
  ? "http://localhost:3000"
  : "https://gmap-theta.vercel.app";

export const sessionOptions = {
  name: "sms_geo.sid",
  secret: "sms_geo_dotty_",
  cookie: {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
  },
};
