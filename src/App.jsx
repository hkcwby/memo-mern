import { useState, useEffect } from "react";
import LeftPanel from "./components/LeftPanel.jsx";
import RightPanel from "./components/RightPanel.jsx";

import { Container, Typography, CssBaseline, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { theme, darkTheme } from "./theme.js";
import { DarkMode, LightMode } from "@mui/icons-material";
import "./App.css";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

function App() {
  const queryClient = useQueryClient();

  // /memo => ["memos"]
  // /memo/1 => ["memos", memo.id]
  const memosQuery = useQuery({
    queryKey: ["memos"],
    queryFn: () =>
      axios.get(`http://localhost:5555/memo/`).then((res) => res.data),
  });

  const memoPostMutation = useMutation({
    mutationFn: (memoDataObject) =>
      axios.post(`http://localhost:5555/memo/add`, memoDataObject),
    onSuccess: () => {
      queryClient.invalidateQueries(["memos"]);
    },
  });

  const memoPutMutation = useMutation({
    mutationFn: (id, memoDataObject) =>
      axios.put(`http://localhost:5555/memo/update/${id}`, memoDataObject),
    onSuccess: () => {
      queryClient.invalidateQueries(["memos"]);
    },
  });

  const memoDeleteMutation = useMutation({
    mutationFn: (_id) => axios.delete(`http://localhost:5555/memo/${_id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["memos"]);
    },
  });

  // if (memosQuery.isLoading) return <h1>loading...</h1>;
  // if (memosQuery.isError) {
  //   return <pre>{JSON.stringify(memosQuery.error)}</pre>;
  // }
  // return (
  //   <>
  //     <div>
  //       {memosQuery.data.map((item) => (
  //         <h2>{item.title}</h2>
  //       ))}
  //     </div>
  //     <button
  //       disabled={memoPostMutation.isLoading}
  //       onClick={() => memoPostMutation.mutate()}
  //     >
  //       submit
  //     </button>
  //   </>
  // );

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

  // async function getMemosDB() {
  //   // get the data from the api
  //   const response = await axios.get(`http://localhost:5555/memo/`);
  //   const newData = await response.data;
  //   if (newData.length > 0) {
  //     setMemos(newData);
  //     setCounter(newData[newData.length - 1].id + 1);
  //     setTracking(newData[newData.length - 1].id + 1);
  //   }
  // }

  //load the data once after mounting

  // useEffect(() => {
  //   getMemosDB();
  // }, []);

  //a function to display relevant memo information(right panel) when memo item clicked(leftpanel)
  function handleMemoClick(_id) {
    //filters for the correct memo based upon its id and sets the data for the the relevant useStates
    // const item = memos.filter((memo) => memo._id == _id);
    const item = memosQuery.data.filter((memo) => memo._id == _id);
    setTracking(item[0]._id);
    setTitle(item[0].title);
    setDetail(item[0].detail);
    setEdit(true);
    // document.getElementById("formDetails").value = detail;
  }

  //a function to remove a memo from storage
  async function handleDeleteClick(_id) {
    console.log(_id, "this is id");
    memoDeleteMutation.mutate(_id);
    // axios.delete(`http://localhost:5555/memo/${_id}`);
    setMemos(memos.filter((memo) => memo._id != _id));
    setTracking(counter);
    setTitle("");
    setDetail("");
  }

  //update the stored title of the memo as it is typed
  function handleTitleChange(e) {
    setTitle(e.target.value);
    console.log(title);
  }
  //update the stored detail of the memo as it is typed
  function handleDetailChange(e) {
    setDetail(e.target.value);
  }
  //posts the memo data to the database
  async function setMemoByID(memoDataObject) {
    memoPostMutation.mutate(memoDataObject);
    // axios.post(`http://localhost:5555/memo/add`, memoDataObject);
  }
  //posts the memo data to the database
  async function updateMemoByID(id, memoDataObject) {
    console.log(memoDataObject);
    memoPutMutation.mutate(id, memoDataObject);
    //axios.put(`http://localhost:5555/memo/update/${id}`, memoDataObject);
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
        // setMemos([
        //   ...memos,
        //   {
        //     id: tracking,
        //     title: title,
        //     detail: detail,
        //   },
        // ]);
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
        // setMemos(
        //   memos.map((memo) =>
        //     memo.id == tracking
        //       ? {
        //           id: tracking,
        //           title: title,
        //           detail: detail,
        //         }
        //       : memo
        //   )
        // );
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
  if (memosQuery.isLoading) return <h1>loading...</h1>;
  if (memosQuery.isError) {
    return <pre>{JSON.stringify(memosQuery.error)}</pre>;
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
            // memos={memos}
            memos={memosQuery.data}
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
