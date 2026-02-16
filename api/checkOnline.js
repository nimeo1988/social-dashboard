import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ status: "error", message: "URL mancante" });

  try {
    const response = await fetch(url, { method: "HEAD", timeout: 5000 });
    if (response.ok) {
      return res.json({ status: "online" });
    } else {
      return res.json({ status: "offline" });
    }
  } catch (err) {
    return res.json({ status: "offline" });
  }
}

