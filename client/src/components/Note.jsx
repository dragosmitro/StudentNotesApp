import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { NoteContent } from "./NoteContent";

export const Note = ({ note, created, accessType, onNoteCreate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");

  const [oldContent, setOldContent] = useState({ title, tag, content });

  const [files, setFiles] = useState([]);

  const retrieveOldContent = () => {
    setTitle(oldContent.title);
    setTag(oldContent.tag);
    setContent(oldContent.content);
  };

  const resetNoteData = () => {
    setTitle("");
    setTag("");
    setContent("");
  };

  const handleNoteClick = () => {
    if (created && !isOpen) {
      setOldContent({
        title: title,
        tag: tag,
        content: content,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleCancelCreate = () => {
    resetNoteData();
    setIsOpen(false);
  };

  const handleCancelUpdate = () => {
    retrieveOldContent();
    setIsOpen(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
    event.target.value = null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "title": {
        setTitle(value);
        break;
      }
      case "tag": {
        setTag(value);
        break;
      }
      case "content": {
        setContent(value);
        break;
      }
      default: {
        return;
      }
    }
  };
  const handleDeleteFile = async (file) => {
    const url = `http://localhost:3001/api/document/delete/${file.id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        await updateFilesList();
      } else {
        const errorData = await response.json();
        console.error("Error deleting file:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const updateFilesList = async () => {
    const url = `http://localhost:3001/api/document/${note.id}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      setFiles(data.documents);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const createNote = async () => {
    if (title === "") {
      alert("Orice notita trebuie sa aiba macar titlu introdus!");
      return;
    }
    const url = "http://localhost:3001/api/note/create";
    const noteData = {
      title: title,
      content: content,
      tag: tag,
    };

    let creatednoteid;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        alert("Eroare la creerea notitei!");
      }

      const data = await response.json();
      creatednoteid = data.id;
    } catch (error) {
      console.log("Error creating note:", error);
    }

    const url2 = "http://localhost:3001/api/access/create/creator";
    const accessData = {
      noteid: creatednoteid,
    };
    try {
      const response = await fetch(url2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(accessData),
      });

      if (!response.ok) {
        alert("Eroare la generarea accesului pentru notita!");
      }
    } catch (error) {
      console.log("Error creating access:", error);
    }
    await onNoteCreate();
    resetNoteData();
    setIsOpen(false);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `http://localhost:3001/api/document/${note.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      updateFilesList();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUpdate = async () => {
    if (title === "") {
      alert("Orice notita trebuie sa aiba macar titlu introdus!");
      return;
    }
    const url = `http://localhost:3001/api/note/${note.id}`;
    const noteData = {
      title: title,
      content: content,
      tag: tag,
    };
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        alert("Eroare la update-ul notitei!");
      }
    } catch (error) {
      console.log("Error updating note:", error);
    }
    setIsOpen(false);
    await onNoteCreate();
  };

  const handleDeleteNote = async () => {
    const url = `http://localhost:3001/api/note/${note.id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        alert("Eroare la stergerea notitei!");
      }
    } catch (error) {
      console.log("Error deleting note:", error);
    }
    await onNoteCreate();
  };

  useEffect(() => {
    if (created) {
      setTitle(note.title);
      setTag(note.tag);
      setContent(note.content);
      updateFilesList();
    }
  }, [note, created]);

  return (
    <React.Fragment>
      <div
        className={classNames(
          "rounded-3xl py-2 px-4",
          { "cursor-pointer": !isOpen },
          { "bg-red-300": accessType === "creator" || !created },
          { "bg-blue-400": accessType === "shared" },
          { "bg-green-400": accessType === "group" },
          { "hover:bg-red-400": accessType === "creator" && !isOpen },
          { "hover:bg-blue-500": accessType === "shared" && !isOpen },
          { "hover:bg-green-500": accessType === "group" && !isOpen }
        )}
      >
        {created ? (
          !isOpen ? (
            <React.Fragment>
              <div
                className="flex text-white justify-between"
                onClick={() => handleNoteClick()}
              >
                <p className="text-xl">{note.title}</p>
                {note.tag && (
                  <p className="bg-gray-500 px-3 rounded-xl">{note.tag}</p>
                )}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <NoteContent
                handleChange={handleChange}
                title={title}
                tag={tag}
                content={content}
                date={note.date}
                files={files}
                handleDelete={handleDeleteFile}
              />
              <div className="flex justify-center gap-x-1 md:gap-x-10">
                <button
                  onClick={() => handleUpdate()}
                  className="inline-flex py-2 px-2 md:px-4 rounded-xl bg-green-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                >
                  Update notita
                </button>
                <button
                  onClick={() => handleCancelUpdate()}
                  className="inline-flex py-2 px-2 md:px-4 rounded-xl bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <label
                  htmlFor={`file-input-${note.id}`}
                  className="inline-flex items-center justify-center py-2 px-2 md:px-4 cursor-pointer rounded-xl bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Adauga fisiere
                  <input
                    id={`file-input-${note.id}`}
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </label>
                <button
                  onClick={() => handleDeleteNote()}
                  className="inline-flex py-2 px-4 rounded-xl bg-red-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
                >
                  Sterge notita
                </button>
              </div>
            </React.Fragment>
          )
        ) : (
          <React.Fragment>
            {!isOpen ? (
              <div
                className="text-xl text-white"
                onClick={() => handleNoteClick()}
              >
                Creeaza o notita noua (+)
              </div>
            ) : (
              <React.Fragment>
                <div className="">
                  <NoteContent
                    handleChange={handleChange}
                    title={title}
                    tag={tag}
                    content={content}
                  />
                  <div className="flex flex-row justify-center gap-x-10">
                    <button
                      onClick={() => {
                        createNote();
                      }}
                      className="inline-flex py-2 px-4 rounded-xl bg-green-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                    >
                      Creeaza notita!
                    </button>
                    <button
                      onClick={() => handleCancelCreate()}
                      className="inline-flex py-2 px-4 rounded-xl bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};
