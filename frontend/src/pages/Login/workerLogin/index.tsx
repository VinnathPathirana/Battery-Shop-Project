import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  rem,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import WorkerAPI from "../../../API/workerAPI/worker.api";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(900),
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(900),
    maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

// login component
const WorkerLoginPage = () => {
  const { classes } = useStyles();

  // Checking login data
  const login = async (values: { nic: string; password: string }) => {
    WorkerAPI.login(values)
      .then((response: any) => {

        // save user details in the local storage
        localStorage.setItem("user-worker-session",JSON.stringify(response.data));

        // navigate to the worker dashboard
        window.location.href = '/worker/managestock';
      })
      .catch((error) => {
        showNotification({
          title : 'User credentials are wrong',
          message :"check your user credentials again",
          color : "red",
          autoClose:1500,
          icon : <IconX size={16}/>
        })
      });
  };

  const loginForm = useForm({
    validateInputOnChange: true,

    initialValues: {
      nic: "",
      password: "",
    },

    // validate data realtime
    validate: {
      nic: (value) =>
        /^([0-9]{9}[v|V]|[0-9]{12})$/.test(value) ? null : "Invalid NIC",
    },
  });

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back worker!
        </Title>

        {/* form */}
        <form
          onSubmit={loginForm.onSubmit(
            (values: { nic: string; password: string }) => {
              login(values);
            }
          )}
        >
          {/* email */}
          <TextInput
            label="NIC"
            placeholder="871301450V"
            size="md"
            {...loginForm.getInputProps("nic")}
          />
          {/* password */}
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...loginForm.getInputProps("password")}
          />

          {/* login button */}
          <Button fullWidth mt="xl" size="md" type="submit">
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default WorkerLoginPage;
