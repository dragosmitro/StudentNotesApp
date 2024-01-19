import React from "react";
import { marked } from "marked";
import { Label } from "./Label";

export const NoteContent = ({
  handleChange,
  title,
  tag,
  content,
  date = "",
  files,
  handleDelete,
}) => {
  const handleDownload = async (file) => {
    const url = `http://localhost:3001/api/document/download/${file.id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  function convertDate(dateObject) {
    const dateTime = new Date(dateObject);
    const localDateTime = new Date(dateTime.getTime());
    const date = localDateTime.getDate().toString().padStart(2, "0");
    const month = (localDateTime.getMonth() + 1).toString().padStart(2, "0");
    const year = localDateTime.getFullYear();
    const hours = localDateTime.getHours().toString().padStart(2, "0");
    const minutes = localDateTime.getMinutes().toString().padStart(2, "0");
    return `data: ${date}.${month}.${year}; ora: ${hours}:${minutes}`;
  }

  const getMarkdownText = (text) => {
    const rawMarkup = marked(text, { sanitize: true });
    return { __html: rawMarkup };
  };
  return (
    <React.Fragment>
      <div className="text-white text-3xl p-4">
        <div className="flex flex-row gap-x-5 text-xl">
          <Label label={"Titlu:"} />
          <input
            onChange={handleChange}
            name="title"
            type="text"
            placeholder="Title..."
            className="placeholder-white bg-transparent rounded-xl border-none outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black p-2"
            value={title}
          />
          <Label label={"Tag:"} />
          <input
            onChange={handleChange}
            name="tag"
            type="text"
            placeholder="Tag..."
            className="placeholder-white bg-transparent rounded-xl border-none outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black p-2"
            value={tag}
          />
          {date !== "" && <Label label={convertDate(date)} />}
        </div>
        <Label label={"Text:"} />
        <textarea
          onChange={handleChange}
          name="content"
          type="text"
          placeholder="Content..."
          className="w-full mt-4 placeholder-white bg-transparent rounded-xl border-none outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-black p-2"
          value={content}
        />
        <Label label={"Preview:"} />
        <div
          className="preview mt-4 p-2"
          dangerouslySetInnerHTML={getMarkdownText(content)}
        />
        {date !== "" && files.length !== 0 && (
          <React.Fragment>
            <Label label={"Files:"} />
            <React.Fragment>
              {files.map((file) => (
                <div className="flex my-1" key={file.id}>
                  <p
                    className="text-sm text-gray-200 px-4 py-1 bg-gray-500 rounded-xl w-min"
                    key={file.id}
                  >
                    {file.filename}
                  </p>
                  <button
                    onClick={() => handleDelete(file)}
                    className="text-sm px-4 py-1 bg-red-400 hover:bg-red-500 rounded-xl mx-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-sm px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded-xl"
                  >
                    Download
                  </button>
                </div>
              ))}
            </React.Fragment>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};
