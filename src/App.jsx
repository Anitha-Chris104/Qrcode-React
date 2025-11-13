import React, { useState } from "react";
const App = () => {
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState("");
  const [qrSize, setQrSize] = useState("150");
  const [inverted, setInverted] = useState(false);

  const defaultImg = "/image/qrcode.png";

  function downloadQr() {
    if (!img) return;
    fetch(img)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  const generateQr = async () => {
    if (!qrData.trim()) {
      alert("Please enter text or a URL first!");
      return;
    }
    setLoading(true);
    try {
      const bgColor = inverted ? "000000" : "ffffff";
      const color = inverted ? "ffffff" : "000000";

      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        qrData
      )}&size=${qrSize}x${qrSize}&bgcolor=${bgColor}&color=${color}`;

      setImg(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle invert colors
  const handleInvert = () => {
    setInverted(!inverted);
    if (qrData) generateQr(); // regenerate if QR already exists
  };

  return (
    <div className="app-container">
      <div className="qr">
        <h5>Invert Color</h5>
        <button onClick={handleInvert}>
          {inverted ? "Normal Colors" : "Invert Colors"}
        </button>
        {loading && <p>Please wait...</p>}

        <img
          src={img || defaultImg}
          alt="QR Code"
          width={qrSize}
          height={qrSize}
        />

        <button onClick={downloadQr}>Download</button>
      </div>
      <div className="side">
        <div className="txt">
          <h4>
            <span>QR</span>code
          </h4>
          <h4 className="lasttext">Generator</h4>
        </div>

        <div className="fields">
          <label htmlFor="dataInput" className="data">
            Submit URL or Text
          </label>
          <input
            type="text"
            id="dataInput"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            placeholder="Enter text or URL..."
          />

          <label htmlFor="sizeInput" className="data">
            Image Size (eg:150)
          </label>
          <input
            type="number"
            id="sizeInput"
            placeholder="Size (e.g., 150)"
            value={qrSize}
            onChange={(e) => setQrSize(e.target.value)}
          />
          <button
            onClick={generateQr}
            disabled={loading}
            className="generate-btn"
          >
            {loading ? "Generating..." : "Generate QR"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
