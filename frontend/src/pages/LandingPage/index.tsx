import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  rem,
  Group,
} from "@mantine/core";
import LoginPage from "../Login";
import { RefObject, useRef } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#11284b",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      "linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, #062343 70%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80)",
    paddingTop: `calc(${theme.spacing.xl} * 3)`,
    paddingBottom: `calc(${theme.spacing.xl} * 3)`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    width: 800,
    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  image: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  content: {
    width: 1000,
    display: "flex",
    alignItems: "center",
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    marginRight: `calc(${theme.spacing.xl} * 3)`,
    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    fontSize: rem(60),

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      fontSize: rem(34),
      lineHeight: 1.15,
    },
  },

  description: {
    color: theme.white,
    opacity: 0.75,
    textAlign:"justify",
    maxWidth: rem(1000),

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
    },
  },

  control: {
    paddingLeft: rem(50),
    paddingRight: rem(50),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(22),

    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },
}));

const LandingPage = () => {
  const { classes } = useStyles();

  //ref the login
  const login: RefObject<HTMLInputElement> = useRef(null);

  //handle scroll
  const handleScroll = (elmRef: any) => {
    window.scrollTo({ top: elmRef.current.offsetTop, behavior: "smooth" })
  }
  
  return (
    <>
      {/* display: "flex", justifyContent: "center", alignItems: "center", */}
      <div className={classes.root} style={{ minHeight: "100vh" }}>
        <Group position="center">
          <Title
            className={classes.title}
            style={{ letterSpacing: "15px", marginTop: "25vh" }}
          >
            SENSUS HUB
          </Title>
        </Group>
        <Group position="center">
          <Text className={classes.description} mt={30}>
            A vehicle battery shop is a specialized retail store that offers a
            wide selection of batteries for cars, trucks, motorcycles, and other
            vehicles. They provide expert advice, services like battery testing
            and installation, and carry accessories for battery maintenance.
            These shops are a convenient one-stop solution for all vehicle
            battery needs, ensuring optimal performance and reliability for
            vehicles.A vehicle battery shop is a specialized establishment that
            focuses on providing batteries for various types of vehicles,
            including cars, trucks, motorcycles, boats, and recreational
            vehicles. These shops offer a wide range of batteries, including
            different sizes, capacities, and technologies to meet the specific
            requirements of different vehicles. 
          </Text>
        </Group>
        <Group position="center">
          <Button
            variant="gradient"
            gradient={{ from: "pink", to: "yellow" }}
            size="xl"
            className={classes.control}
            mt={40}
            onClick={()=>handleScroll(login)}
          >
            Get started
          </Button>
        </Group>
      </div>

      {/* // connect Login Page */}

      <LoginPage ref={login}/>
    </>
  );
};

export default LandingPage;
