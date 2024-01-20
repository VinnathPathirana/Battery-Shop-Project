import {
  createStyles,
  Table,
  ScrollArea,
  Text,
  TextInput,
  rem,
  LoadingOverlay,
  ActionIcon,
  Tooltip,
  Group,
  Modal,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconDownload, IconSearch, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import InvoiceAPI from "../../API/InvoiceAPI/Invoice.api";
import { useQuery } from "@tanstack/react-query";
import { IconEye } from "@tabler/icons-react";
import InvoiceTemplate from "./invoiceTemplate";

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
  invoice_id: string;
  phone_number: string;
  cusName: string;
  issued_date: string;
  warnty_priod: String;
  sellingPrice: string;
  batry_brand: string;
  quantity: string;
  totalPrice: string;
}

function filterData(data: Data[], search: string) {
    const query = search.toString().toLowerCase().trim();
  
    return data.filter((item) =>
      keys(data[0]).some((key) =>
        item[key].toString().toLowerCase().includes(query)
      )
    );
  }

interface ItemData {
  _id: string;
  brand: string;
  quantity: number;
  totalPrice: number;
  warranty: string;
  price: number;
}
interface moreInfo {
  _id: string;
  cusName: string;

  invoice_id: string;

  cusAddress: string;

  cusPhone: string;

  issuedDate: Date;

  items: [
    {
      _id: string;
      brand: string;
      quantity: number;
      totalPrice: number;
      warranty: string;
      price: number;
    }
  ];

  totalActualPrice: number;

  totalSoldPrice: number;

  discount: number;
}
const Invoices = () => {
  const [search, setSearch] = useState("");
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [sortedData, setSortedData] = useState<Data[]>([]);

  // use react query and fetch data
  const { data = [], isLoading, isError } = useQuery(
    ["invoiceData"],
    () => {
      return InvoiceAPI.getAllInvoice().then((res) => res.data);
    },
    { initialData: []}
  );

  // Format the prices
  // format number to SL rupee
  let rupee = new Intl.NumberFormat("ta-LK", {
    style: "currency",
    currency: "LKR",
  });

  //   open more information modal
  const [openedMoreInfo, setOpenedMoreInfo] = useState(false);

  // invoice modal
  const[opnedInvoiceModal,setOpenedInvoiceModal] = useState(false);

  const[invoiceData,setInvoiceData] = useState();
  
  // store row information
  const [row, setRow] = useState<moreInfo>({
    _id: "",
    cusName: "",

    invoice_id: "",

    cusAddress: "",

    cusPhone: "",

    issuedDate: new Date(),

    items: [
      {
        _id: "",
        brand: "",
        quantity: 0,
        totalPrice: 0,
        warranty: "",
        price: 0,
      },
    ],

    totalActualPrice: 0,

    totalSoldPrice: 0,

    discount: 0,
  });

  
  // search filter
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(filterData(data, value)); //store filtered data in the search state
    if (sortedData.length === data.length) {
      setSortedData([]);
    }
  };
  


  // rows map
  const rows = Array.isArray(data) ? data?.map((row: any) => (
    <tr key={row._id}>
      <td>
        <Text size={15}>{row.invoice_id}</Text>
      </td>
      <td>
        <Text size={15}>{row.cusName}</Text>
      </td>
      <td>
        {row.cusAddress.length === 0 ? (<Text size={15} color={"red"}>N/A</Text>):<Text size={15}>{row.cusAddress}</Text>}
      </td>
      <td>
        <Text size={15}>{row.cusPhone}</Text>
      </td>
      <td>
        {row.cusEmail.length === 0 ? (<Text size={15} color={"red"}>N/A</Text>):<Text size={15}>{row.cusEmail}</Text>}
      </td>
      <td>
        <Text size={15}>
          {row.discount === 0 ? (
            <Text color="red" weight={500}>
              NO DISCOUNT
            </Text>
          ) : (
            rupee.format(row.discount)
          )}
        </Text>
      </td>
      <td>
        <Text size={15}>{rupee.format(row.totalSoldPrice)}</Text>
      </td>
      <td>
        <td>
          {new Date(row.issuedDate).toLocaleDateString("en-GB").split("T")[0]}
        </td>
        <Text size={15}>{row.sellingPrice}</Text>
      </td>
      <td>
        <Group spacing={"sm"}>
          <Tooltip label="View more information">
            <ActionIcon
              color="teal"
              size={"sm"}
              onClick={() => {
                setRow(row);
                setOpenedMoreInfo(true);
              }}
            >
              <IconEye />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="download Invoice">
            <ActionIcon
              color="blue"
              size={"sm"}
              onClick={() => {
                setOpenedInvoiceModal(true);
                setInvoiceData(row);
              }}
            >
              <IconDownload />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </tr>
  )):null;

  // if data is fetching this overalay will be shows to the user
  if (isLoading) {
    return <LoadingOverlay visible={isLoading} overlayBlur={2} />;
  }

  if (isError) {
    showNotification({
      title: "Cannot fetching Invoice Data",
      message: "check internet connection",
      color: "red",
      icon: <IconX />,
      autoClose: 1500,
    });
  }

  const moreInfoRows = row.items.map((item: ItemData) => (
    <tr id={item._id}>
      <td>{item.brand}</td>
      <td>{item.warranty}</td>
      <td>{rupee.format(item.price)}</td>
      <td>{item.quantity}</td>
      <td>{rupee.format(item.totalPrice)}</td>
    </tr>
  ));

  // table
  return (
    <div>

      {/* invoice moda */}
      <Modal onClose={()=>{setOpenedInvoiceModal(false);}} opened={opnedInvoiceModal} size={"50%"}>
        <InvoiceTemplate data={invoiceData}/>
      </Modal>

      {/* more Information Modal */}
      <Modal
        size={"80%"}
        opened={openedMoreInfo}
        onClose={() => {
          setOpenedMoreInfo(false);
          setRow({
            _id: "",
            cusName: "",

            invoice_id: "",

            cusAddress: "",

            cusPhone: "",

            issuedDate: new Date(),

            items: [
              {
                _id: "",
                brand: "",
                quantity: 0,
                totalPrice: 0,
                warranty: "",
                price: 0,
              },
            ],

            totalActualPrice: 0,

            totalSoldPrice: 0,

            discount: 0,
          });
        }}
      >
        <Text weight={600} size={"lg"} align="center">
          {`${row.invoice_id} (Items)`}
        </Text>
        <Table
          highlightOnHover
          horizontalSpacing={100}
          verticalSpacing="md"
          mt={10}
          miw={700}
          sx={{ tableLayout: "fixed" }}
        >
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr>
              <th>Brand</th>
              <th>Warranty</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>{moreInfoRows}</tbody>
        </Table>
      </Modal>
      {/* search bar */}
      <TextInput
        placeholder="Search by any field"
        mt={50}
        mb={50}
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
        w={800}
        style={{ position: "relative", left: "50%", translate: "-50%" }}
      />

      <ScrollArea
        w={"100mw"}
        h={600}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          horizontalSpacing={100}
          verticalSpacing="md"
          miw={700}
          sx={{ tableLayout: "fixed" }}
        >
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr>
              <th>Invoice Id</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone number</th>
              <th>Email</th>
              <th>Discount Price</th>
              <th>Total Price</th>
              <th>Issued Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows !== null ? rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={9}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            ):null}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default Invoices;
