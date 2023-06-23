import { useState, useEffect } from "react";
import LeftPanel from "./components/LeftPanel.jsx";
import RightPanel from "./components/RightPanel.jsx";
import firebase from "./firebase.js";
import { Container, Typography, CssBaseline, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { theme, darkTheme } from "./theme.js";
import { DarkMode, LightMode } from "@mui/icons-material";
import "./App.css";
import axios from "axios";

function App() {
  const ref = firebase.firestore().collection("memos");
  //the memo data as stored in the database, in this case we are just using a dummy file to represent our database
  // example of a memo array [{ id: 1, title: "hello", detail:"world" },]
  const [memos, setMemos] = useState([]);

  //useState variable for both the title and detail of our present memo shown on the right panel
  const [mode, setMode] = useState(true);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  // a counter for creating new unique memo id
  const [counter, setCounter] = useState(0);
  //a tracking variable to keep track of the current memo based on its unique id
  const [tracking, setTracking] = useState(0);
  //set a validation variable to catch errors and provide user feedback
  const [validation, setValidation] = useState("");
  //differentiate between an edit and a new memo
  const [edit, setEdit] = useState(false);

  function darkModeToggle() {
    setMode(!mode);
  }

  async function getMemosDB() {
    // get the data from the api
    const response = await axios.get(`http://localhost:5555/memo/`);
    const newData = await response.data;
    if (newData.length > 0) {
      setMemos(newData);
      setCounter(newData[newData.length - 1].id + 1);
      setTracking(newData[newData.length - 1].id + 1);
    }
  }

  //load the data once after mounting

  useEffect(() => {
    getMemosDB();
  }, []);

  useEffect(() => {
    console.log(counter);
  }, [counter]);

  //a function to display relevant memo information(right panel) when memo item clicked(leftpanel)
  function handleMemoClick(id) {
    //filters for the correct memo based upon its id and sets the data for the the relevant useStates
    const item = memos.filter((memo) => memo.id == id);
    setTracking(item[0].id);
    setTitle(item[0].title);
    setDetail(item[0].detail);
    setEdit(true);
    // document.getElementById("formDetails").value = detail;
  }

  //a function to remove a memo from storage
  async function handleDeleteClick(id) {
    //ref.doc(String(id)).delete();
    axios.delete(`http://localhost:5555/memo/${id}`);
    setMemos(memos.filter((memo) => memo.id != id));
    setTracking(counter);
    setTitle("");
    setDetail("");
  }

  //update the stored title of the memo as it is typed
  function handleTitleChange(e) {
    setTitle(e.target.value);
  }
  //update the stored detail of the memo as it is typed
  function handleDetailChange(e) {
    setDetail(e.target.value);
  }
  //posts the memo data to the database
  async function setMemoByID(memoDataObject) {
    axios.post(`http://localhost:5555/memo/add`, memoDataObject);
  }
  //posts the memo data to the database
  async function updateMemoByID(id, memoDataObject) {
    axios.put(`http://localhost:5555/memo/update/${id}`, memoDataObject);
  }
  //event loop after a submission is made
  function handleMemoSubmit(event) {
    event.preventDefault();
    //check validations
    if (!title) {
      setValidation("Please enter a Title");
      return;
    } else if (!detail) {
      setValidation("Please enter some details");
      return;
    } else if (memos.length >= 8) {
      setValidation("limit of 8 memos for demonstrative purposes");
      return;
    } else {
      //if validations are fine proceed to load the new memo into the frontend store
      if (!edit) {
        setMemos([
          ...memos,
          {
            id: tracking,
            title: title,
            detail: detail,
          },
        ]);
        //also post to the back end store
        setMemoByID({
          id: tracking,
          title: title,
          detail: detail,
        }).then(() => {
          //finally reset memo details and adjust tracking and counter
          setTitle("");
          setDetail("");
          setValidation("");
          setTracking(counter + 1);
          setCounter(counter + 1);
        });
      } else {
        setMemos(
          memos.map((memo) =>
            memo.id == tracking
              ? {
                  id: tracking,
                  title: title,
                  detail: detail,
                }
              : memo
          )
        );
        //also post to the back end store
        updateMemoByID(tracking, {
          id: tracking,
          title: title,
          detail: detail,
        }).then(() => {
          //finally reset memo details and adjust tracking and counter
          setTitle("");
          setDetail("");
          setValidation("");
          setTracking(counter + 1);
          setCounter(counter + 1);
        });
      }
    }
  }

  //a function to generate a clean memo for submission with a rudimentary unique id system
  function handleComposeClick() {
    setEdit(false);
    setTracking(counter);
    setTitle("New title");
    setDetail("New memo");
  }

  return (
    <ThemeProvider theme={mode ? theme : darkTheme}>
      <Box className="smartphone">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey",
            height: "30vh",
            "@media (max-width: 40rem)": {
              height: "10vw",
              fontSize: "1rem",
            },
          }}
        >
          {mode ? (
            <DarkMode
              sx={{ alignSelf: "start", margin: "1vh" }}
              onClick={() => darkModeToggle()}
            />
          ) : (
            <LightMode
              sx={{ alignSelf: "start", margin: "1vh" }}
              onClick={() => darkModeToggle()}
            />
          )}
          <Typography
            variant="h2"
            align="center"
            color="white"
            sx={{
              "@media (max-width: 40rem)": {
                fontSize: "0.8rem",
              },
            }}
          >
            Simple Memo Task App Mockup (Material UI)
          </Typography>
        </Box>
        <Container
          sx={{
            display: "flex",
            "@media (max-width: 40rem)": {
              flexDirection: "column",
              overflow: "scroll",
              height: "470px",
            },
          }}
        >
          <LeftPanel
            memos={memos}
            tracking={tracking}
            onMemoClick={handleMemoClick}
            onDeleteClick={handleDeleteClick}
            onComposeClick={handleComposeClick}
          ></LeftPanel>
          <RightPanel
            title={title}
            detail={detail}
            onSubmit={handleMemoSubmit}
            onChangeTitle={(e) => handleTitleChange(e)}
            onChangeDetail={(e) => handleDetailChange(e)}
            validation={validation}
          ></RightPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
