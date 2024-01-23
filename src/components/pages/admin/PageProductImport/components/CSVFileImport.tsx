import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<any>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    // Get the presigned URL
    const response = await axios({
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": "4aec7aa45e4040a384529fd777984a64",
      },
      url,
      params: {
        name: file?.name.replace(/[^\w.]/g, "_"),
      },
    });
    console.log("File to upload: ", file?.name);
    console.log("Uploading to: ", response.data);
    const result = await fetch(response.data, {
      method: "PUT",
      body: file,
      headers: {
        "Ocp-Apim-Subscription-Key": "4aec7aa45e4040a384529fd777984a64",
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "text/csv",
      },
    });
    console.log("Result: ", result);
    setFile("");
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
    </Box>
  );
}
