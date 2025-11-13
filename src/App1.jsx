import React, { useState } from "react";

const App = () => {
  const [qrData, setQrData] = useState("");
  const [qrSize, setQrSize] = useState("150");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [inverted, setInverted] = useState(false);

  // ✅ Default placeholder image (keep this inside public/image/)
  const defaultImg = "/image/qr.png";

  // Generate QR Code
  const generateQr = async () => {
    if (!qrData.trim()) {
      alert("Please enter text or a URL first!");
      return;
    }

    setLoading(true);
    try {
      // ✅ QRServer API: change colors based on invert toggle
      const bgColor = inverted ? "000000" : "ffffff";
      const color = inverted ? "ffffff" : "000000";

      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        qrData
      )}&size=${qrSize}x${qrSize}&bgcolor=${bgColor}&color=${color}`;

      setImgUrl(url);
    } catch (error) {
      console.error("Error generating QR:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download QR
  const downloadQr = () => {
    if (!imgUrl) return;
    fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  // Toggle invert colors
  const handleInvert = () => {
    setInverted(!inverted);
    if (qrData) generateQr(); // regenerate if QR already exists
  };

  return (
    <div className="app-container" style={styles.container}>
      <h2 style={styles.title}>🎯 QR Code Generator</h2>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Enter text or URL..."
          value={qrData}
          onChange={(e) => setQrData(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Size (e.g., 150)"
          value={qrSize}
          onChange={(e) => setQrSize(e.target.value)}
          style={styles.input}
        />

        <button onClick={generateQr} disabled={loading} style={styles.button}>
          {loading ? "Generating..." : "Generate QR"}
        </button>
      </div>

      <div style={styles.qrContainer}>
        <img
          src={imgUrl || defaultImg}
          alt="QR Code"
          width={qrSize}
          height={qrSize}
          style={{
            borderRadius: "10px",
            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
            backgroundColor: inverted ? "black" : "white",
          }}
        />
      </div>

      <div style={styles.actions}>
        <button onClick={handleInvert} style={styles.button}>
          {inverted ? "Normal Colors" : "Invert Colors"}
        </button>

        <button onClick={downloadQr} disabled={!imgUrl} style={styles.button}>
          Download
        </button>
      </div>
    </div>
  );
};

// 🎨 Inline styles for simplicity
const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    fontFamily: "Poppins, sans-serif",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "200px",
  },
  button: {
    padding: "10px 16px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
  },
  qrContainer: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
};

export default App;
