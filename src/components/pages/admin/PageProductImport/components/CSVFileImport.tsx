import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [status, setStatus] = React.useState("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
    setStatus("");
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setStatus("Requesting signed URL...");
      const response = await axios.get(url, {
        params: { name: encodeURIComponent(file.name) },
      });

      const signedUrl = response.data;

      setStatus("Uploading file...");
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": "text/csv",
        },
      });

      setStatus("Upload successful!");
      setFile(undefined);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("Upload failed!");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
      {status && <p>{status}</p>}
    </Box>
  );
}
