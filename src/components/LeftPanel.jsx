import { Container, Typography, Button, Box } from "@mui/material";
import { Add, Clear, Edit } from "@mui/icons-material";

function LeftPanel(props) {
  return (
    <Container
      id="left-panel"
      sx={{
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        "@media (max-width: 40rem)": {
          height: "20vh",
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          margin: "8vh",

          "@media (max-width: 40rem)": {
            display: "none",
          },
        }}
      >
        Memos
      </Typography>
      <Box
        sx={{
          alignSelf: "center",
          flexGrow: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "space-evenly",
          minWidth: "20vw",
          "@media (max-width: 40rem)": {
            flexGrow: 0,
            marginTop: "2vh",
          },
        }}
      >
        {props.memos.map((item, index) => (
          <Box sx={{ display: "flex" }}>
            {item._id == props.tracking ? (
              <Typography
                key={item.id}
                id={`list-item-${item.id}`}
                sx={{
                  margin: "1vh",
                  flexGrow: "2",
                  fontWeight: "bold",
                  "@media (max-width: 40rem)": {
                    fontSize: "0.8rem",
                  },
                }}
              >
                {item.title}
              </Typography>
            ) : (
              <Typography
                key={item.id}
                id={`list-item-${item.id}`}
                sx={{
                  margin: "1vh",
                  flexGrow: "2",
                  "@media (max-width: 40rem)": {
                    fontSize: "0.8rem",
                  },
                }}
              >
                {item.title}
              </Typography>
            )}
            <Edit
              onClick={() => props.onMemoClick(item._id)}
              sx={{
                borderStyle: "solid",
                borderRadius: "20%",
                margin: "1vh",
                "&:hover": {
                  border: "1px solid black",
                  color: "darkgray",
                  backgroundColor: "grey",
                },
                "@media (max-width: 40rem)": {
                  fontSize: "1.3rem",
                  margin: ".5vh",
                },
              }}
            />
            <Clear
              onClick={() => props.onDeleteClick(item._id)}
              sx={{
                borderStyle: "solid",
                borderRadius: "20%",
                margin: "1vh",
                "&:hover": {
                  border: "1px solid black",
                  color: "darkgray",
                  backgroundColor: "grey",
                },
                "@media (max-width: 40rem)": {
                  fontSize: "1.3rem",
                  margin: ".5vh",
                },
              }}
            />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          "@media (max-width: 40rem)": {
            flexGrow: 2,
          },
        }}
      >
        <Add
          onClick={props.onComposeClick}
          sx={{
            margin: "4vh",
            borderStyle: "solid",
            borderRadius: "20%",
            "&:hover": {
              border: "1px solid black",
              color: "darkgray",
              backgroundColor: "grey",
            },
            "@media (max-width: 40rem)": {
              fontSize: "1.3rem",
              margin: ".5vh",
            },
          }}
        />
      </Box>
    </Container>
  );
}

export default LeftPanel;
