import {
  createStyles,
  Table,
  ScrollArea,
  Group,
  Text,
  TextInput,
  rem,
  ActionIcon,
  Tooltip,
  Button,
  Textarea,
  Box,
  Modal,
  LoadingOverlay,
  Indicator,
  Popover,
  NumberInput,
  NumberInputHandlers,
  Select,
  Autocomplete,
  Loader,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
  IconCheck,
  IconShoppingCartPlus,
  IconShoppingCart,
  IconTrashX,
  IconDiscount2,
  IconDiscount2Off,
  IconAt,
  IconArrowBarToUp,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import BatteryAPI from "../../API/batteryAPI/battery.api";
import { useQuery } from "@tanstack/react-query";
import { IconFileBarcode } from "@tabler/icons-react";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import InvoiceAPI from "../../API/InvoiceAPI/Invoice.api";
import InvoiceTemplate from "../Invoices/invoiceTemplate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { StockPDF } from "../PDFRender/stockPDF";

// styles
const useStyles = createStyles((theme) => ({
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
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
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
  stock_id: string;
  quantity: string;
  added_date: string;
  warnty_period: string;
  sellingPrice: string;
  actualPrice: string;
  batry_brand: string;
  Battery_description: string;
}

interface cartData {
  _id: string;
  brand: string;
  quantity: number;
  actualTotal: number;
  price: number;
  warranty: string;
  totalPrice: number;
}
function filterData(data: Data[], search: string) {
  const query = search.toString().toLowerCase().trim();

  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
  );
}

const ManageStocks = () => {
  const [search, setSearch] = useState("");
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [opened, setOpened] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [sortedData, setSortedData] = useState<Data[]>([]);

  // for number quantity Input
  const [qvalue, setQValue] = useState<number | "">(0);
  const handlers = useRef<NumberInputHandlers>();

  //store cart details
  const [cartData, setCartData] = useState<cartData[]>([]); //state for storing cart data

  // open the cart modal
  const [cartOpened, setCartOpened] = useState(false);

  // use react query and fetch data
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["stockData"],
    () => {
      return BatteryAPI.getAllItems().then((res) => res.data);
    },
    { initialData: [] }
  );

  // Format the prices
  // format number to SL rupee
  let rupee = new Intl.NumberFormat("ta-LK", {
    style: "currency",
    currency: "LKR",
  });

  // store the cart discount
  const [cartDiscount, setCartDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");

  // customer details modal
  const [openedCustomerDetails, setOpenedCutomerDetails] = useState(false);

  // show the loading overlay when adding invoice to the database
  const [invoiceOverlay, setInvoiceOverlay] = useState(false);

  // search filter
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(filterData(data, value)); //store filtered data in the search state
    if (sortedData.length === data.length) {
      setSortedData([]);
    }
  };

  // open invoice modal
  const [openedInvoiceModal, setOpenedInvoiceModal] = useState(false);

  const [invoiceData, setInvoiceData] = useState({});


  // customer email
  const timeoutRef = useRef<number>(-1);
  const[emailLoader,setEmailloader] = useState(false);
  const[email,setEmail] = useState('');
  const[emailData,setEmailData] = useState<string[]>([])


  // manage add quantity manage popover
  const [openedPopOver,setOpenedPopOver] = useState(false);


  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      quantity: "",
      added_date: "",
      warnty_priod: "",
      sellingPrice: "",
      actualPrice: "",
      batry_brand: "",
      Battery_description: "",
    },
  });

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      _id: "",
      stock_id: "",
      quantity: "",
      added_date: new Date(),
      warnty_priod: "",
      sellingPrice: "",
      actualPrice: "",
      batry_brand: "",
      Battery_description: "",
    },
  });

  // customer details form
  const customerForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      phoneNumber: "",
      address: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Please enter valid name" : null),
      phoneNumber: (value) =>
        value.length !== 10 ? "Please enter valid phone number" : null,
    },
  });

  //add Items
  const addItems = async (values: {
    quantity: string;
    added_date: string;
    warnty_priod: String;
    sellingPrice: string;
    actualPrice: string;
    batry_brand: string;
    Battery_description: string;
  }) => {
    showNotification({
      id: "add-items",
      loading: true,
      title: "Adding Items record",
      message: "Please wait while we add Items record..",
      autoClose: false,
    });
    BatteryAPI.addBattery(values)
      .then((response) => {
        updateNotification({
          id: "add-items",
          color: "teal",
          icon: <IconCheck />,
          title: "Items added successfully",
          message: "Items data added successfully.",
          //icon: <IconCheck />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);

        // refetch data from the database
        refetch();
      })
      .catch((error) => {
        updateNotification({
          id: "add-items",
          color: "red",
          title: "Items Adding failed",
          icon: <IconX />,
          message: "We were unable to add the Items",
          // icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  //update Item  function
  const updateItem = async (values: {
    _id: string;
    stock_id: string;
    quantity: string;
    added_date: Date;
    warnty_priod: String;
    sellingPrice: string;
    actualPrice: string;
    batry_brand: string;
    Battery_description: string;
  }) => {
    showNotification({
      id: "update-items",
      loading: true,
      title: "Updating Items record",
      message: "Please wait while we update Items record..",
      autoClose: false,
    });
    BatteryAPI.updateBattery(values)
      .then((response) => {
        updateNotification({
          id: "update-items",
          color: "teal",
          icon: <IconCheck />,
          title: "Items updated successfully",
          message: "Items data updated successfully.",
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
          id: "update-items",
          color: "red",
          title: "Items updatimg failed",
          icon: <IconX />,
          message: "We were unable to update the Items",
          // icon: <IconAlertTriangle />,
          autoClose: 5000,
        });
      });
  };

  // calculate the actual TotalOf the Items
  const calculateActualTotal = () => {
    let total = 0;
    cartData.map((item) => {
      total += item.actualTotal;
    });
    return total;
  };

  // save invoice data in the database
  const saveInvoice = (values: any) => {
    // set invoice overlay visible
    setInvoiceOverlay(true);

    // create invoice object
    const invoice = {
      cusName: values.name,
      cusAddress: values.address,
      cusPhone: values.phoneNumber,
      cusEmail : email,
      items: [...cartData],
      issuedDate: new Date(),
      discount: calculateDiscount(),
      totalSoldPrice: calculateTotalPrice() - calculateDiscount(),
      totalActualPrice: calculateActualTotal(),
    };

    // invoice modal open
    setInvoiceData(invoice);

    // open invoice modal
    setOpenedInvoiceModal(true);

    // call to the API and send back to the backend
    InvoiceAPI.submitInvoice(invoice)
      .then((res) => {
        // after successing the invoice saving set to overlay disappear
        setInvoiceOverlay(false);

        // refetch new Data
        refetch();

        // clear previous cus email details
        setEmail('');
        setEmailData([]);
        setEmailloader(false);

        // also show the notification
        showNotification({
          title: "Invoice Saved Successful",
          message: "Invoice data saved successfully",
          autoClose: 2500,
          color: "teal",
          icon: <IconCheck />,
        });
      })
      .catch((error) => {
        // if error happens,

        // 1. overlay will be disappeared
        setInvoiceOverlay(false);

        // then show the error notification
        showNotification({
          title: "Saving invoice failed",
          message: "Something went wrong while saving invoice data",
          autoClose: 2500,
          color: "red",
          icon: <IconX />,
        });
      });
  };

  // Cart Confirmation Modal

  const openCartCheckoutModal = (values: any) =>
    modals.openConfirmModal({
      zIndex: 2000,
      shadow: "xl",
      title: "Checkout confimation",
      children: (
        <Text size="sm">
          Are you sure to proceed checkout? That means you are going to generate
          a Invoice.This action cannot be reversed!
        </Text>
      ),
      labels: { confirm: "Checkout", cancel: "Cancel" },
      confirmProps: { color: "teal" },
      onCancel: () => modals.close,
      onConfirm: () => {
        saveInvoice(values);
        setOpenedCutomerDetails(false);
        customerForm.reset();
        setCartOpened(false);
        setCartData([]);
        setCartDiscount(0);
      },
    });

  // delete Stock function
  const deleteSpecificStock = (values: {
    _id: string;
    reason: string;
    stock_id: string;
  }) => {
    BatteryAPI.deleteBattery(values)
      .then((res) => {
        showNotification({
          title: `${values.stock_id} was deleted`,
          message: "Stock was deleted successfully",
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
          title: `${values.stock_id} was not deleted`,
          message: "Stock was not deleted",
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
      reason: "",
      stock_id: "",
      _id: "",
    },

    validate: {
      reason: (values) => (values.length > 5 ? null : "Please enter reason"),
    },
  });

  const updateCartData = (row: any) => {
    let updateExist = false;

    if (cartData.length === 0) {
      // create object for storing the cart
      const newCartData = {
        _id: row._id,
        brand: row.batteryBrand,
        quantity: parseInt(qvalue.toString()),
        price: row.sellingPrice,
        warranty: row.warranty,
        actualTotal: parseFloat(row.actualPrice) * parseInt(qvalue.toString()),
        totalPrice: parseFloat(row.sellingPrice) * parseInt(qvalue.toString()),
      };
      //save the cart details in the state
      setCartData((current) => [...current, newCartData]);
    } else {
      const modifiedCart = cartData.map((item) => {
        if (item._id === row._id) {
          updateExist = true;

          return {
            _id: item._id,
            brand: item.brand,
            quantity: item.quantity + parseInt(qvalue.toString()),
            price: item.price,
            warranty: item.warranty,
            actualTotal:
              (item.quantity + parseInt(qvalue.toString())) * row.actualPrice,
            totalPrice:
              (item.quantity + parseInt(qvalue.toString())) * row.sellingPrice,
          };
        } else {
          return item;
        }
      });

      if (updateExist) {
        setCartData([...modifiedCart]);
      } else {
        // create object for storing the cart
        const newCartData = {
          _id: row._id,
          brand: row.batteryBrand,
          quantity: parseInt(qvalue.toString()),
          price: row.sellingPrice,
          warranty: row.warranty,
          actualTotal:
            parseFloat(row.actualPrice) * parseInt(qvalue.toString()),
          totalPrice:
            parseFloat(row.sellingPrice) * parseInt(qvalue.toString()),
        };
        //save the cart details in the state
        setCartData((current) => [...current, newCartData]);
      }
    }

    // shows the confirmation notification
    showNotification({
      title: "Item added to the cart",
      message: "Item added to the cart successfully",
      autoClose: 1000,
      color: "teal",
      icon: <IconCheck />,
    });
  };

  //declare the rows variable and based on the filtered data or row data, it will print the table data!
  let rows = [];

  // rows map
  if (sortedData.length > 0) {
    rows = sortedData?.map((row: any) => (
      <tr key={row._id}>
        <td>
          <Text size={15}>{row.stock_id}</Text>
        </td>
        <td>
          <Text size={15}>{row.batteryBrand}</Text>
        </td>
        <td>
          <Text size={15}>{row.batteryDescription}</Text>
        </td>
        <td>
          <Text size={15}>
            {row.quantity === 0 ? (
              <Text color="red" weight={500}>
                OUT OF STOCK
              </Text>
            ) : (
              row.quantity
            )}
          </Text>
        </td>
        <td>
          <Text size={15}>{rupee.format(row.sellingPrice)}</Text>
        </td>
        <td>
          <Text size={15}>
            {new Date(row.added_date).toLocaleDateString("en-GB").split("T")[0]}
          </Text>
        </td>
        <td>
          <Text size={15}>{row.warranty}</Text>
        </td>
        <td>
          {
            <>
              <Group spacing={"xs"}>
                {/* add to cart */}
                <Popover
                  trapFocus
                  position="bottom"
                  withArrow
                  shadow="md"
                  onClose={() => {
                    setQValue(0);
                  }}
                  disabled={row.quantity === 0 || cartOpened === true || openedInvoiceModal === true ? true : false}
                >
                  <Popover.Target>
                    <ActionIcon color={row.quantity === 0 ? "gray" : "blue"} >
                      <IconShoppingCartPlus />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    {/* text of the selection */}
                    <Text mb={10} style={{ textAlign: "center" }} weight={500}>
                      Select quantity
                    </Text>
                    <Group spacing={5} position="center">
                      <ActionIcon
                        size={42}
                        variant="default"
                        onClick={() => handlers.current?.decrement()}
                      >
                        –
                      </ActionIcon>

                      <NumberInput
                        hideControls
                        value={qvalue}
                        onChange={(val) => setQValue(val)}
                        handlersRef={handlers}
                        max={row.quantity}
                        min={0}
                        step={1}
                        styles={{
                          input: { width: rem(54), textAlign: "center" },
                        }}
                      />

                      <ActionIcon
                        size={42}
                        variant="default"
                        onClick={() => handlers.current?.increment()}
                      >
                        +
                      </ActionIcon>
                    </Group>

                    <Text
                      size={"xs"}
                      color={"red"}
                      mt={10}
                    >{`*Note that, you can select maximum ${row.quantity} items only.`}</Text>
                    <Group position="center" spacing={"sm"} grow>
                      <Button
                        size="xs"
                        mt={10}
                        disabled = {qvalue === 0 ? true : false}
                        leftIcon={<IconShoppingCartPlus size={15} />}
                        onClick={() => {
                          updateCartData(row);
                        }}
                      >
                        Add to cart
                      </Button>
                      <Button
                        size="xs"
                        mt={10}
                        disabled = {qvalue === 0 ? true : false}
                        leftIcon={<IconArrowBarToUp size={15} />}
                        color="orange"
                        onClick={() => {
                          updateCartData(row);
                          setCartOpened(true);
                        }}
                      >
                        Open in cart
                      </Button>
                    </Group>
                  </Popover.Dropdown>
                </Popover>
                {/* edit button */}
                <Tooltip label="Edit stock">
                  <ActionIcon
                    color="teal"
                    onClick={() => {
                      editForm.setValues({
                        _id: row._id,
                        stock_id: row.stock_id,
                        Battery_description: row.batteryDescription,
                        batry_brand: row.batteryBrand,
                        actualPrice: row.actualPrice,
                        sellingPrice: row.sellingPrice,
                        quantity: row.quantity,
                        added_date: new Date(row.added_date),
                        warnty_priod: row.warranty,
                      });
                      setEditOpened(true);
                    }}
                  >
                    <IconEdit />
                  </ActionIcon>
                </Tooltip>

                {/* delete button */}
                <Tooltip label="Delete stock">
                  <ActionIcon
                    color="red"
                    onClick={() => {
                      deleteForm.setValues({
                        _id: row._id,
                        stock_id: row.stock_id,
                      });
                      setDeleteOpen(true);
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </>
          }
        </td>
      </tr>
    ));
  } else {
    rows = data?.map((row: any) => (
      <tr key={row._id}>
        <td>
          <Text size={15}>{row.stock_id}</Text>
        </td>
        <td>
          <Text size={15}>{row.batteryBrand}</Text>
        </td>
        <td>
          <Text size={15}>{row.batteryDescription}</Text>
        </td>
        <td>
          <Text size={15}>
            {row.quantity === 0 ? (
              <Text color="red" weight={500}>
                OUT OF STOCK
              </Text>
            ) : (
              row.quantity
            )}
          </Text>
        </td>
        <td>
          <Text size={15}>{rupee.format(row.sellingPrice)}</Text>
        </td>
        <td>
          <Text size={15}>
            {new Date(row.added_date).toLocaleDateString("en-GB").split("T")[0]}
          </Text>
        </td>
        <td>
          <Text size={15}>{row.warranty}</Text>
        </td>
        <td>
          {
            <>
              <Group spacing={"xs"}>
                {/* add to cart */}
                <Popover
                  trapFocus
                  position="bottom"
                  withArrow
                  shadow="md"
                  onClose={() => {
                    setQValue(0);
                  }}
                  disabled={row.quantity === 0 || cartOpened === true || openedInvoiceModal === true ? true : false}
                >
                  <Popover.Target>
                    <ActionIcon color={row.quantity === 0 ? "gray" : "blue"} >
                      <IconShoppingCartPlus />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    {/* text of the selection */}
                    <Text mb={10} style={{ textAlign: "center" }} weight={500}>
                      Select quantity
                    </Text>
                    <Group spacing={5} position="center">
                      <ActionIcon
                        size={42}
                        variant="default"
                        onClick={() => handlers.current?.decrement()}
                      >
                        –
                      </ActionIcon>

                      <NumberInput
                        hideControls
                        value={qvalue}
                        onChange={(val) => setQValue(val)}
                        handlersRef={handlers}
                        max={row.quantity}
                        min={0}
                        step={1}
                        styles={{
                          input: { width: rem(54), textAlign: "center" },
                        }}
                      />

                      <ActionIcon
                        size={42}
                        variant="default"
                        onClick={() => handlers.current?.increment()}
                      >
                        +
                      </ActionIcon>
                    </Group>

                    <Text
                      size={"xs"}
                      color={"red"}
                      mt={10}
                    >{`*Note that, you can select maximum ${row.quantity} items only.`}</Text>
                    <Group position="center" spacing={"sm"} grow>
                      <Button
                        size="xs"
                        mt={10}
                        disabled = {qvalue === 0 ? true : false}
                        leftIcon={<IconShoppingCartPlus size={15} />}
                        onClick={() => {
                          updateCartData(row);
                        }}
                      >
                        Add to cart
                      </Button>
                      <Button
                        size="xs"
                        mt={10}
                        disabled = {qvalue === 0 ? true : false}
                        leftIcon={<IconArrowBarToUp size={15} />}
                        color="orange"
                        onClick={() => {
                          updateCartData(row);
                          setCartOpened(true);
                        }}
                      >
                        Open in cart
                      </Button>
                    </Group>
                  </Popover.Dropdown>
                </Popover>

                {/* edit button */}
                <Tooltip label="Edit stock">
                  <ActionIcon
                    color="teal"
                    onClick={() => {
                      editForm.setValues({
                        _id: row._id,
                        stock_id: row.stock_id,
                        Battery_description: row.batteryDescription,
                        batry_brand: row.batteryBrand,
                        actualPrice: row.actualPrice,
                        sellingPrice: row.sellingPrice,
                        quantity: row.quantity,
                        added_date: new Date(row.added_date),
                        warnty_priod: row.warranty,
                      });
                      setEditOpened(true);
                    }}
                  >
                    <IconEdit />
                  </ActionIcon>
                </Tooltip>

                {/* delete button */}
                <Tooltip label="Delete stock">
                  <ActionIcon
                    color="red"
                    onClick={() => {
                      deleteForm.setValues({
                        _id: row._id,
                        stock_id: row.stock_id,
                      });
                      setDeleteOpen(true);
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </>
          }
        </td>
      </tr>
    ));
  }

  // cart rowws
  const cartRows = cartData.map((item: any, index: any) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.brand}</td>
      <td>{item.warranty}</td>
      <td>{rupee.format(item.price)}</td>
      <td>{item.quantity}</td>
      <td>{rupee.format(item.totalPrice)}</td>
    </tr>
  ));
  // if data is fetching this overalay will be shows to the user
  if (isLoading) {
    return <LoadingOverlay visible={isLoading} overlayBlur={2} />;
  }

  if (isError) {
    showNotification({
      title: "Cannot fetching Stock Data",
      message: "check internet connection",
      color: "red",
      icon: <IconX />,
      autoClose: 1500,
    });
  }

  // calculate the total of the cart items
  const calculateTotalPrice = () => {
    let total = 0;
    cartData.map((item) => {
      total += item.totalPrice;
    });
    return total;
  };

  // calculate Discount
  const calculateDiscount = () => {
    if (discountType === "PERCENTAGE") {
      return (calculateTotalPrice() * cartDiscount) / 100;
    } else {
      return cartDiscount;
    }
  };

  const handleEmailChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setEmail(val);
    setEmailData([]);

    if (val.trim().length === 0 || val.includes('@')) {
      setEmailloader(false);
    } else {
      setEmailloader(true);
      timeoutRef.current = window.setTimeout(() => {
        setEmailloader(false);
        setEmailData(['gmail.com', 'outlook.com', 'yahoo.com'].map((provider) => `${val}@${provider}`));
      }, 300);
    }
  };

  // table
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between" }}
      pos="relative"
    >
      {/* invoice moda */}
      <Modal
        onClose={() => {
          // refetch the stocks data
          refetch();
          setOpenedInvoiceModal(false);
        }}
        opened={openedInvoiceModal}
        size={"50%"}
      >
        <InvoiceTemplate data={invoiceData} />
      </Modal>

      {/* loading overaly when creating the invoice */}
      <LoadingOverlay visible={invoiceOverlay} overlayBlur={2} />
      {/* Customer details getting */}
      <Modal
        opened={openedCustomerDetails}
        onClose={() => setOpenedCutomerDetails(false)}
        title="Customer Details"
        size={"lg"}
        zIndex={1000}
      >
        <form
          onSubmit={customerForm.onSubmit((values) => {
            openCartCheckoutModal(values);
          })}
        >
          <TextInput
            label="Customer name"
            withAsterisk
            placeholder="Gayan Silve"
            required
            mb={10}
            {...customerForm.getInputProps("name")}
          />
          <TextInput
            label="Phone Number"
            withAsterisk
            placeholder="0712906815"
            required
            mb={10}
            {...customerForm.getInputProps("phoneNumber")}
          />
          <Autocomplete
            label="Email"
            value = {email}
            data={emailData}
            onChange={handleEmailChange}
            rightSection={emailLoader ? <Loader size="1rem" /> : null}
            placeholder="example@gmail.com"
            mb={10}
            icon={<IconAt size="0.8rem"/>}
          />
          <TextInput
            label="Address"
            placeholder="No . 119 Malabe,Kaduwela"
            mb={10}
            {...customerForm.getInputProps("address")}
          />
          <Group grow position="center">
            <Button
              rightIcon={<IconArrowNarrowRight size={18} />}
              color="teal"
              mt={10}
              type="submit"
            >
              CHECKOUT
            </Button>
          </Group>
        </form>
      </Modal>
      {/* cart Modal */}
      <Modal
        opened={cartOpened}
        onClose={() => setCartOpened(false)}
        title="Item cart"
        size={"80%"}
      >
        <Group position="right">
          <Button
            color="red"
            mb={10}
            leftIcon={<IconTrashX size={18} />}
            onClick={() => {
              setCartData([]);
              setCartDiscount(0);
              setDiscountType("");
            }}
            variant="subtle"
          >
            CLEAR ALL
          </Button>
          {/* discount popup */}
          <Popover
            width={300}
            trapFocus
            position="bottom"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Button
                leftIcon={<IconDiscount2 size={18} />}
                mb={10}
                variant="subtle"
              >
                DISCOUNT
              </Button>
            </Popover.Target>
            <Popover.Dropdown
              sx={(theme) => ({
                background:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.white,
              })}
            >
              <Select
                label="Discount type"
                size="xs"
                defaultChecked
                value={discountType}
                data={[
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "CASH", label: "Cash" },
                ]}
                onChange={(e) => {
                  setDiscountType(e ? e : "");
                }}
              />
              <NumberInput
                size="xs"
                value={cartDiscount}
                label="Discount Amount"
                placeholder="5000 or 5%"
                onChange={(e) => setCartDiscount(e ? e : 0)}
              />
            </Popover.Dropdown>
          </Popover>
          <Button
            variant="subtle"
            color="red"
            mb={10}
            leftIcon={<IconDiscount2Off size={18} />}
            onClick={() => {
              setCartDiscount(0);
              setDiscountType("");
            }}
          >
            CLEAR DISCOUNT
          </Button>
        </Group>
        <Table
          withBorder
          withColumnBorders
          highlightOnHover
          horizontalSpacing={60}
          verticalSpacing="md"
          miw={700}
          fontSize={15}
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Brand</th>
              <th>Warranty</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cartData.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <Text size={20} weight={500} align="center">
                    Cart is empty.
                  </Text>
                </td>
              </tr>
            ) : (
              cartRows
            )}
            {cartDiscount !== 0 ? (
              <tr>
                <td colSpan={5}>
                  <Text weight={500} align="center">
                    DISCOUNT
                  </Text>
                </td>
                <td>{`- ${rupee.format(calculateDiscount())}`}</td>
              </tr>
            ) : null}
            {cartData.length !== 0 ? (
              <tr style={{ background: "#f8f8fa" }}>
                <td colSpan={5}>
                  {cartDiscount > 0 ? (
                    <Text weight={500} align="center">
                      SUB TOTAL
                    </Text>
                  ) : (
                    <Text weight={500} align="center">
                      TOTAL
                    </Text>
                  )}
                </td>
                <td>
                  <Text weight={cartDiscount == 0 ? 600 : 400} size={20}>
                    {rupee.format(calculateTotalPrice())}
                  </Text>
                </td>
              </tr>
            ) : null}
            {cartDiscount !== 0 ? (
              <tr>
                <td colSpan={5}>
                  <Text weight={500} align="center">
                    TOTAL
                  </Text>
                </td>
                <td>
                  {
                    <Text weight={600} size={21}>
                      {rupee.format(
                        calculateTotalPrice() - calculateDiscount()
                      )}
                    </Text>
                  }
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>

        <Group position="right" mt={10} mb={10}>
          <Button
            rightIcon={<IconArrowNarrowRight size={18} />}
            color="green"
            disabled={cartData.length > 0 ? false : true}
            onClick={() => setOpenedCutomerDetails(true)}
          >
            NEXT
          </Button>
        </Group>
      </Modal>

      {/* // delete modal */}
      <Modal
        opened={deleteOpen}
        centered
        onClose={() => {
          addForm.reset();
          setDeleteOpen(false);
        }}
        title="Delete Stock"
      >
        <Box>
          <Text size={"sm"} mb={10}>
            Are you sure you want to delete this stock? This action cannot be
            undone!
          </Text>
          <form
            onSubmit={deleteForm.onSubmit((values) => {
              deleteSpecificStock(values);
            })}
          >
            <TextInput
              withAsterisk
              label="Stock ID"
              required
              disabled
              {...deleteForm.getInputProps("stock_id")}
              mb={10}
            />
            <Textarea
              placeholder="This was added mistakenly"
              label="Reason"
              withAsterisk
              required
              autosize
              minRows={3}
              {...deleteForm.getInputProps("reason")}
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

      {/* stock add Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add Items Record"
      >
        <form onSubmit={addForm.onSubmit((values) => addItems(values))}>
          <TextInput
            label="Battery brand"
            placeholder="Enter Brand name"
            {...addForm.getInputProps("batry_brand")}
            required
          />
          <TextInput
            label="Battery description"
            placeholder="Enter Battery Description"
            {...addForm.getInputProps("Battery_description")}
            required
          />
          <TextInput
            label="Quantity"
            placeholder="Enter Battery quantity"
            {...addForm.getInputProps("quantity")}
            required
          />
          <TextInput
            label="Actual Price"
            placeholder="Enter Actual Price of a Battery"
            {...addForm.getInputProps("actualPrice")}
            required
          />
          <TextInput
            label="Selling Price"
            placeholder="Enter Selling Price of a battery"
            {...addForm.getInputProps("sellingPrice")}
            required
          />
          <DateInput
            placeholder="Adding date"
            label="Adding date"
            valueFormat="YYYY MMM DD"
            withAsterisk
            {...addForm.getInputProps("added_date")}
          />
          <TextInput
            label="Warnty priod(In years)"
            placeholder="Enter warnty priod"
            {...addForm.getInputProps("warnty_priod")}
            required
          />
          <Button
            color="blue"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Add
          </Button>
        </form>
      </Modal>

      {/* items edit model */}
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Update Item Record"
      >
        <form onSubmit={editForm.onSubmit((values) => updateItem(values))}>
          <TextInput
            withAsterisk
            label="Stock ID"
            required
            disabled
            {...editForm.getInputProps("stock_id")}
          />
          <TextInput
            label="Battery brand"
            placeholder="Enter Brand name"
            {...editForm.getInputProps("batry_brand")}
            required
          />
          <TextInput
            label="Battery description"
            placeholder="Enter Battery Description"
            {...editForm.getInputProps("Battery_description")}
            required
          />
          <TextInput
            label="Quantity"
            placeholder="Enter Battery quantity"
            {...editForm.getInputProps("quantity")}
            required
          />
          <TextInput
            label="Actual Price"
            placeholder="Enter actual Price of a Battery"
            {...editForm.getInputProps("actualPrice")}
            required
          />
          <TextInput
            label="Selling Price"
            placeholder="Enter selling Price of a battery"
            {...editForm.getInputProps("sellingPrice")}
            required
          />
          <DateInput
            placeholder="Added date"
            label="Added date"
            valueFormat="YYYY MMM DD"
            withAsterisk
            {...editForm.getInputProps("added_date")}
          />
          <TextInput
            label="warnty priod"
            placeholder="Enter warnty priod"
            {...editForm.getInputProps("warnty_priod")}
            required
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
      <div>
        <Group spacing={35} mb={70} mt={-30}>
          {/* search bar */}
          <TextInput
            placeholder="Search by any field"
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            ml={"12%"}
            w={"60%"}
          />
          <Group spacing={"lg"} ml={-10}>
            {" "}
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              leftIcon={<IconPlus size={20} />}
              onClick={() => setOpened(true)}
            >
              New Stock
            </Button>
            <PDFDownloadLink
              document={<StockPDF data={data} />}
              fileName={`STOCKDETAILS`}
            >
              <Button
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
                leftIcon={<IconFileBarcode size={20} />}
              >
                Generate Report
              </Button>
            </PDFDownloadLink>
            <Tooltip label="Cart">
              <Indicator
                color="red"
                size={14}
                disabled={cartData.length === 0 ? true : false}
              >
                <ActionIcon
                  variant="outline"
                  size={35}
                  onClick={() => {
                    setCartOpened(true);
                  }}
                >
                  <IconShoppingCart />
                </ActionIcon>
              </Indicator>
            </Tooltip>
          </Group>
        </Group>
        <ScrollArea
          w={"100mw"}
          h={600}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table
            highlightOnHover
            horizontalSpacing={60}
            verticalSpacing="lg"
            miw={700}
            sx={{ tableLayout: "fixed" }}
          >
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <tr>
                <th>Stock_id</th>
                <th>Brand</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Selling Price</th>
                <th>Added Date</th>
                <th>Warranty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows?.length > 0 ? (
                rows
              ) : (
                <tr>
                  <td>
                    <Text weight={500} align="center">
                      Nothing found
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </div>
    </Box>
  );
};

export default ManageStocks;
