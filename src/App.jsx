import { useState, useEffect } from "react";
import LeftPanel from "./components/LeftPanel.jsx";
import RightPanel from "./components/RightPanel.jsx";
import firebase from "./firebase.js";
import { Container, Typography, CssBaseline, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { theme, darkTheme } from "./theme.js";
import { DarkMode, LightMode } from "@mui/icons-material";
import "./App.css";

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

  function darkModeToggle() {
    setMode(!mode);
  }

  function getMemosDB() {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setMemos(items);
      setCounter(items[items.length - 1].id + 1);

      //   setTitle(items[0].title);
      //   setDetail(items[0].detail);
      //   setTracking(items[0].id);
    });
  }

  //load the data once after mounting

  useEffect(() => {
    getMemosDB(true);
  }, []);

  //a function to display relevant memo information(right panel) when memo item clicked(leftpanel)
  function handleMemoClick(id) {
    //filters for the correct memo based upon its id and sets the data for the the relevant useStates
    const item = memos.filter((memo) => memo.id == id);
    setTracking(item[0].id);
    setTitle(item[0].title);
    setDetail(item[0].detail);
    //document.getElementById("formDetails").value=detail;
  }

  //a function to remove a memo from storage
  function handleDeleteClick(id) {
    ref.doc(String(id)).delete();
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

  async function setMemoByID(memoID, memoDataObject) {
    //example data for the first memo in the database
    //ref.doc("0").set({title:"title of the first memo",id:0,detail:"details of the first memo"})
    await ref.doc(memoID).set(memoDataObject);
  }

  function handleMemoSubmit(event) {
    event.preventDefault();
    if (!title) {
      setValidation("Please enter a Title");
      return;
    }
    if (!detail) {
      setValidation("Please enter some details");
      return;
    }

    if (memos.length >= 8) {
      setValidation("limit of 8 memos for demonstrative purposes");
      return;
    }
    setTracking(counter + 1);
    setMemoByID(String(tracking), {
      title: title,
      id: tracking,
      detail: detail,
    }).then(() => {
      setTitle("");
      setDetail("");
      setValidation("");
    });
  }

  //a function to generate a clean memo for submission with a rudimentary unique id system
  function handleComposeClick() {
    setTracking(counter);
    setTitle("");
    setDetail("");
    // document.getElementById("formDetails").value=detail;
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
