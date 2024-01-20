import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  LoadingOverlay,
  Paper,
  Box,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import BatteryAPI from "../../API/batteryAPI/battery.api";
import { showNotification } from "@mantine/notifications";

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
}));

interface RowData {
  name: string;
  item: string;
  description: string;
  id: string;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export function DeletedTable() {
  const { classes, cx } = useStyles();
    const {data = [],isError,isLoading} = useQuery(['deleteStocks'],()=>{
      return BatteryAPI.getDeletedStocks().then((res) => res.data);
    },{initialData : []})


  const rows = Array.isArray(data) ? data?.map((row) => (
    <tr key={row._id}>
      <td>{row.stock_id}</td>
      <td>{`${row.batteryBrand} ${row.batteryDescription}`}</td>
      <td>{row.quantity === 0 ? <Text weight={500} color="red">OUT OF STOCK</Text> : row.quantity}</td>
      <td>{new Date(row.added_date).toLocaleDateString("en-GB").split("T")[0]}</td>
      <td>{<Box p={15} style={{border :"1px solid red"}}><Text weight={600} size={"md"} align="center">{row.isDeleted.description}</Text></Box>}</td>
    </tr>
  )): null;

  if(isLoading){
    return <LoadingOverlay visible={isLoading} overlayBlur={2} />;
  }

  if(isError){
    showNotification({
      title: "Cannot fetching Stock Data",
      message: "check internet connection",
      color: "red",
      icon: <IconX />,
      autoClose: 1500,
    });
  }

  return (
    <ScrollArea>
      <Group spacing={35} mb={10} mt={50}>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          w={800}
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          // value={search}
          // onChange={handleSearchChange}
        />
      </Group>
      <Table
        // horizontalSpacing="md"
        verticalSpacing={20}
        miw={700}
        sx={{ tableLayout: "fixed" }}
      >
        <thead className={classes.tableHeader} >
          <tr>
            <th>Stock ID</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Added Date</th>
            <th>Reason</th>
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
  );
}
