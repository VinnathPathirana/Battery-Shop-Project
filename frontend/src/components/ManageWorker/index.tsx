import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Text,
  Center,
  TextInput,
  rem,
  ActionIcon,
  Tooltip,
  Container,
  Grid,
  PasswordInput,
  Select,
  Box,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button } from "@mantine/core";
import WorkerAPI from "../../API/workerAPI/worker.api";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import AdminAPI from "../../API/adminAPI/admin.api";

const useStyles = createStyles((theme) => ({


  tableHeader: {
    backgroundColor: theme.colors.gray[2], // Change this color as per your preference
  },

  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
  header: {
    position: "sticky",
    zIndex: 100,
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface Data {
  _id: string;
  worker_id: string;
  name: string;
  email: string;
  phone: string;
  nic: string;
  address: String;
  gender: string;
}

function filterData(data: Data[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

const ManageWorker = () => {
  const [search, setSearch] = useState("");
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [opened, setOpened] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  const {
    data = [],
    isError,
    isLoading,
    refetch,
  } = useQuery(
    ["workerData"],
    () => {
      return WorkerAPI.getAllWorkerDetails().then((res) => res.data);
    },
    { initialData: [] }
  );

  const registerForm = useForm({
    validateInputOnChange: true,

    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      nic: "",
      address: "",
      gender: "",
    },

    // Validate Data in real time

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",

      phone: (value) =>
        /^\d{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits long number",

      nic: (value) => {
        if (!value) {
          return "This field is Required";
        }
        if (
          !/^\S+@\S+$/.test(value) &&
          !/^([0-9]{9}[v|V]|[0-9]{12})$/.test(value)
        ) {
          return "Invalid email or NIC";
        }
        return null;
      },
    },
  });

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      _id: "",
      worker_id: "",
      name: "",
      email: "",
      phone: "",
      nic: "",
      address: "",
      gender: "",
    },

    // Validate Data in real time

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",

      phone: (value) =>
        /^\d{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits long number",

      nic: (value) => {
        if (!value) {
          return "This field is Required";
        }
        if (
          !/^\S+@\S+$/.test(value) &&
          !/^([0-9]{9}[v|V]|[0-9]{12})$/.test(value)
        ) {
          return "Invalid email or NIC";
        }
        return null;
      },
    },
  });

  const registerWorker = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
    nic: string;
    address: string;
    gender: string;
  }) => {
    showNotification({
      id: "Add Worker",
      loading: true,
      title: "Adding Worker record",
      message: "Please wait while we add Worker record..",
      autoClose: false,
    });

    AdminAPI.workerRegister(values)
      .then((Response) => {
        updateNotification({
          id: "Add Worker",
          color: "teal",
          title: "Adding Worker record",
          message: "Please wait while we add Worker record..",
          icon: <IconCheck />,
          autoClose: 2500,
        });

        registerForm.reset();
        setOpened(false);

        // getting updated details from the DB
        refetch();
      })
      .catch((error) => {
        updateNotification({
          id: "Add Worker",
          color: "red",
          title: "Something went wrong!",
          message: "There is a problem when adding worker",
          icon: <IconX />,
          autoClose: 2500,
        });
      });
  };

  const getWorkerDetails = async () => {
    showNotification({
      id: "get-worker-details",
      loading: true,
      title: "Fetching Worker Details",
      message: "Please wait while we fetch worker details..",
      autoClose: false,
    });

    try {
      const workerDetails = await WorkerAPI.getAllWorkerDetails();

      updateNotification({
        id: "get-worker-details",
        color: "teal",
        icon: <IconCheck />,
        title: "Worker Details Fetched",
        message: "Successfully fetched worker details.",
        autoClose: 5000,
      });

      return workerDetails;
    } catch (error) {
      updateNotification({
        id: "get-worker-details",
        color: "red",
        icon: <IconX />,
        title: "Failed to Fetch Worker Details",
        message: "We were unable to fetch worker details.",
        autoClose: 5000,
      });

      throw error;
    }
  };

  //update Item  function
  const updateWorker = async (values: {
    _id: string;
    worker_id: string;
    name: string;
    email: string;
    phone: string;
    nic: string;
    address: string;
    gender: string;
  }) => {
    showNotification({
      id: "update-worker",
      loading: true,
      title: "Updating Worker record",
      message: "Please wait while we update Worker record..",
      autoClose: false,
    });
    WorkerAPI.updateWorker(values)
      .then((response) => {
        updateNotification({
          id: "update-worker",
          color: "teal",
          icon: <IconCheck />,
          title: "Worker updated successfully",
          message: "Worker data updated successfully.",
          //icon: <IconCheck />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);

        //getting updated items from database
        refetch();
      })
      .catch((error) => {
        updateNotification({
          id: "update-worker",
          color: "red",
          title: "Worker updating failed",
          icon: <IconX />,
          message: "We were unable to update the Worker",
          // icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  //Delete Worker function
  const workerDelete = (values: { _id: string; nic: string; name: string }) => {
    WorkerAPI.deleteWorker(values)
      .then((res) => {
        showNotification({
          title: `${values.name} was deleted`,
          message: "Worker was deleted successfully",
          autoClose: 1500,
          icon: <IconCheck />,
          color: "teal",
        });

        // after successing the deletion refetch the data from the database
        refetch();

        // clear all the fields
        deleteForm.reset();

        // then close the delete modal
        setDeleteOpen(false);
      })
      .catch((err) => {
        showNotification({
          title: `${values.name} was not deleted`,
          message: "Worker was not deleted",
          autoClose: 1500,
          icon: <IconX />,
          color: "red",
        });
      });
  };

  // form for deletion
  const deleteForm = useForm({
    validateInputOnChange: true,

    initialValues: {
      _id: "",
      nic: "",
      name: "",
    },
  });

  const rows = Array.isArray(data)
    ? data?.map((row: any) => (
        <tr key={row._id}>
          <td>
            <Text size={15}>{row.name}</Text>
          </td>
          <td>
            <Text size={15}>{row.email}</Text>
          </td>
          <td>
            <Text size={15}>{row.phone}</Text>
          </td>

          <td>
            <Text size={15}>{row.address}</Text>
          </td>
          <td>
            <Text size={15}>{row.nic}</Text>
          </td>
          <td>
            <Text size={15}>{row.gender}</Text>
          </td>
          <td>
            {
              <>
                <Group spacing={"sm"}>
                  {/* edit button */}
                  <Tooltip label="Edit worker">
                    <ActionIcon
                      color="teal"
                      onClick={() => {
                        editForm.setValues({
                          _id: row._id,
                          worker_id: row.worker_id,
                          name: row.name,
                          email: row.email,
                          phone: row.phone,
                          nic: row.nic,
                          address: row.address,
                          gender: row.gender,
                        });
                        setEditOpened(true);
                      }}
                    >
                      <IconEdit size={30} />
                    </ActionIcon>
                  </Tooltip>

                  {/* delete button */}
                  <Tooltip label="Delete worker">
                    <ActionIcon
                      color="red"
                      onClick={() => {
                        deleteForm.setValues({
                          _id: row._id,
                          nic: row.nic,
                          name: row.name,
                        });
                        setDeleteOpen(true);
                      }}
                    >
                      <IconTrash size={30} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </>
            }
          </td>
        </tr>
      ))
    : null;

  if (isLoading) {
    return <LoadingOverlay visible={isLoading} overlayBlur={2} />;
  }

  if (isError) {
    showNotification({
      title: "Something went wrong!",
      message: "There was an error while fetching data",
      autoClose: 1500,
      color: "red",
      icon: <IconX />,
    });
  }

  return (
    <div>
      {/*Worker update model */}
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Update Worker Record"
      >
        <form onSubmit={editForm.onSubmit((values) => updateWorker(values))}>
          <TextInput
            label="Worker Name"
            placeholder="Enter Worker name"
            {...editForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter Worker Email"
            {...editForm.getInputProps("email")}
            required
          />
          <TextInput
            label="phone"
            placeholder="Enter Worker Phone Number "
            {...editForm.getInputProps("phone")}
            required
          />
          <TextInput
            label="Address"
            placeholder="Enter Worker Address"
            {...editForm.getInputProps("address")}
            required
          />
          <TextInput
            label="NIC"
            placeholder="Enter Worker NIC number"
            {...editForm.getInputProps("nic")}
            required
          />

          <Select
            name="gender"
            label="Gender"
            placeholder="Select gender"
            required
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            {...editForm.getInputProps("gender")}
          />
          <Button
            color="blue"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Save
          </Button>
        </form>
      </Modal>

      {/* // delete modal */}
      <Modal
        opened={deleteOpen}
        centered
        onClose={() => {
          deleteForm.reset();
          setDeleteOpen(false);
        }}
        title="Delete Worker"
      >
        <Box>
          <Text size={"sm"} mb={10}>
            Are you sure you want to delete this Worker? This action cannot be
            undone!
          </Text>
          <form
            onSubmit={deleteForm.onSubmit((values) => {
              workerDelete(values);
            })}
          >
            <TextInput
              withAsterisk
              label="Worker Name"
              required
              disabled
              {...deleteForm.getInputProps("name")}
              mb={10}
            />

            <Group position="right" spacing={"md"} mt={20}>
              <Button
                color="gray"
                variant="outline"
                onClick={() => {
                  deleteForm.reset();
                  setDeleteOpen(false);
                }}
              >
                No I don't delete it
              </Button>
              <Button
                color="red"
                type="submit"
                leftIcon={<IconTrash size={16} />}
              >
                Delete it
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Modal
        opened={opened}
        onClose={() => {
          registerForm.reset();
          setOpened(false);
        }}
        title="Add Items Record"
      >
        <form
          onSubmit={registerForm.onSubmit((values) => registerWorker(values))}
        >
          <TextInput
            label="Name"
            placeholder="Enter name"
            name="name"
            required
            {...registerForm.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            name="email"
            required
            {...registerForm.getInputProps("email")}
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...registerForm.getInputProps("password")}
          />

          <TextInput
            label="Phone"
            placeholder="Enter phone"
            name="phone"
            required
            mt="md"
            {...registerForm.getInputProps("phone")}
          />

          <TextInput
            label="NIC"
            placeholder="Enter NIC"
            name="nic"
            required
            mt="md"
            {...registerForm.getInputProps("nic")}
          />

          <TextInput
            name="address"
            label="Address"
            placeholder="Enter address"
            required
            mt="md"
            {...registerForm.getInputProps("address")}
          />

          <Select
            name="gender"
            label="Gender"
            placeholder="Select gender"
            required
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            {...registerForm.getInputProps("gender")}
          />

          <Button fullWidth mt="xl" type="submit">
            Add Worker
          </Button>
        </form>
      </Modal>

      {/* search bar */}
      <div style={{ display: "flex", alignItems: "center" }}>
  <TextInput
    placeholder="Search by any field"
    mt={50}
    mb={50}
    icon={<IconSearch size="0.9rem" stroke={1.5} />}
    // value={search}
    // onChange={handleSearchChange}
    w={800}
  />
  <Button
    leftIcon={<IconPlus size={20} />}
    ml={10}
    onClick={() => setOpened(true)}
  >
    Add New Worker
  </Button>
</div>


      <ScrollArea
        w={"100mw"}
        h={600}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          horizontalSpacing={30}
          verticalSpacing="lg"
          miw={700}
          sx={{ tableLayout: "fixed" }}
        >
         <thead className={cx(classes.header, classes.tableHeader, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>NIC</th>
              <th>Gender</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows !== null ? (
              rows.length > 0 ? (
                rows
              ) : (
                <tr>
                  <td>
                    <Text weight={500} align="center">
                      Nothing found
                    </Text>
                  </td>
                </tr>
              )
            ) : null}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ManageWorker;
