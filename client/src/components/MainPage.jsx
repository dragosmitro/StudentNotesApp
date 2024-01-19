import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import { Note } from "./Note";
import { Filter } from "./Filter";

export const MainPage = ({ setLoggedIn, user }) => {
  const [noteList, setNoteList] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [displayedNotes, setDisplayedNotes] = useState([]);

  const [filters, setFilters] = useState({
    title: "",
    tag: "",
    content: "",
    dataOrder: "none",
  });

  const getAccessList = async () => {
    const url = `http://localhost:3001/api/access/${user.id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        alert("User neautorizat!");
        setLoggedIn(false);
      }

      const data = await response.json();
      setAccessList(data.accessList);
      getNotes(data.accessList);
    } catch (error) {
      console.log("Error getting accessList:", error);
    }
  };

  const getNotes = async (accessList) => {
    const url = `http://localhost:3001/api/note/ids`;
    const ids = [];
    accessList.map((access) => {
      ids.push(access.noteid);
    });

    const noteIds = {
      noteids: ids,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(noteIds),
      });

      if (!response.ok) {
        alert("User neautorizat!");
        setLoggedIn(false);
      }

      const data = await response.json();
      setNoteList(data);
    } catch (error) {
      console.log("Error getting accessList:", error);
    }
  };

  function getType(index) {
    return accessList[index].type;
  }

  const applyFilters = () => {
    let filteredNotes = noteList.filter((note) =>
      accessList.some((access) => access.noteid === note.id)
    );

    if (filters.title) {
      filteredNotes = filteredNotes.filter((note) =>
        note.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.tag) {
      filteredNotes = filteredNotes.filter((note) =>
        note.tag.toLowerCase().includes(filters.tag.toLowerCase())
      );
    }

    if (filters.content) {
      filteredNotes = filteredNotes.filter((note) =>
        note.content.toLowerCase().includes(filters.content.toLowerCase())
      );
    }

    if (filters.dataOrder !== "none") {
      filteredNotes.sort((a, b) => {
        const dateA = new Date(a.date),
          dateB = new Date(b.date);
        return filters.dataOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return filteredNotes;
  };

  const onFilterChange = ({ type, value }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  useEffect(() => {
    const fetchAccessList = async () => {
      await getAccessList();
    };
    fetchAccessList();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      if (accessList.length > 0) {
        await getNotes(accessList);
      }
    };
    fetchNotes();
  }, [accessList]);

  useEffect(() => {
    const filteredNotes = applyFilters();
    setDisplayedNotes(filteredNotes);
  }, [noteList, filters]);

  const fetchLists = async () => {
    await getAccessList();
  };

  return (
    <React.Fragment>
      <Header setLoggedIn={setLoggedIn} username={user.username} />
      <Filter onFilterChange={onFilterChange} />
      <div className="flex flex-col gap-y-4 m-4">
        {displayedNotes.length !== 0 &&
          displayedNotes.map((note, index) => {
            if (index < accessList.length) {
              return (
                <Note
                  note={note}
                  key={note.id}
                  created={true}
                  accessType={getType(index)}
                  onNoteCreate={fetchLists}
                />
              );
            }
            return null;
          })}
        <Note
          created={false}
          externalAccess={false}
          accessType={"creator"}
          onNoteCreate={fetchLists}
        />
      </div>
    </React.Fragment>
  );
};
