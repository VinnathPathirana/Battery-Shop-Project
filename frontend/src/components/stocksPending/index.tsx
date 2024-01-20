import {
    createStyles,
    Table,
    ScrollArea,
    Text,
    TextInput,
    rem,
    LoadingOverlay,
    Badge,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
    IconSearch,
    IconCheck,
    IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import BatteryAPI from "../../API/batteryAPI/battery.api";
import { useQuery } from '@tanstack/react-query';
import { modals } from "@mantine/modals";

const useStyles = createStyles((theme) => ({

    tableHeadings: {
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
            borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark"
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
    added_data: string;
    warnty_priod: String;
    sellingPrice: string;
    actualPrice: string;
    batry_brand: string;
    Battery_description: string;
}

function filterData(data: Data[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
    );
}

const PendingStock = () => {
    
    const [search, setSearch] = useState("");
    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [opened, setOpened] = useState(false);


    // use react query and fetch data
    const { data = [], isLoading, isError, refetch } = useQuery(["stockData"], () => {
        return BatteryAPI.getRequestedStocks().then((res) => res.data)
    }, { initialData: [] })


    // accept Stock function
    const acceptStock = (stockId: string) => {
        BatteryAPI.acceptStock(stockId)
            .then((res) => {
                showNotification({
                    title: `Stock was accepted`,
                    message: "Stock was accepted successfully",
                    autoClose: 1500,
                    icon: <IconCheck />,
                    color: "teal",
                });

                // after successing the accepting, refetch the data from the database
                refetch();
            })
            .catch((err) => {
                showNotification({
                    title: `stock was not accepted`,
                    message: "Stock was not accpeted",
                    autoClose: 1500,
                    icon: <IconX />,
                    color: "red",
                });
            });
    };



    // delete Stock function
    const deleteSpecificStock = (stockId: string) => {
        BatteryAPI.rejectBattery(stockId)
            .then((res) => {
                showNotification({
                    title: `Stock was deleted`,
                    message: "Stock was deleted successfully",
                    autoClose: 1500,
                    icon: <IconCheck />,
                    color: "teal",
                });

                // after successing the deletion refetch the data from the database
                refetch();

            })
            .catch((err) => {
                showNotification({
                    title: `stock was not deleted`,
                    message: "Stock was not deleted",
                    autoClose: 1500,
                    icon: <IconX />,
                    color: "red",
                });
            });
    };

    // reject confirmation modal
    const openDeleteModal = (stockId: string) =>
        modals.openConfirmModal({
            title: 'Delete your profile',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to reject this stock? This action cannot be undone later.
                </Text>
            ),
            labels: { confirm: 'Reject stock', cancel: "No don't reject it" },
            confirmProps: { color: 'red' },
            onCancel: () => modals.close,
            onConfirm: () => deleteSpecificStock(stockId),
        });


    // accept modal
    const openAcceptModal = (stockId: string) => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                Are you sure you want to accept this stock? This stcok will be added to the stock.
            </Text>
        ),
        labels: { confirm: 'Accept', cancel: 'Cancel' },
        confirmProps: { color: "teal" },
        onCancel: () => modals.close,
        onConfirm: () => acceptStock(stockId),
    });

    // rows map
    const rows = Array.isArray(data) ? data?.map((row: any) => (
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
                <Text size={15}>{row.quantity}</Text>
            </td>
            <td>
                <Text size={15}>{row.sellingPrice}</Text>
            </td>
            <td>
                <Text size={15}>{new Date(row.added_date).toLocaleDateString('en-GB').split('T')[0]}</Text>
            </td>
            <td>
                <Text size={15}>{row.warranty}</Text>
            </td>
            <td>
                <Badge color="pink" variant="light">
                    PENDING
                </Badge>
            </td>

        </tr>
    )) : null;

    // if data is fetching this overalay will be shows to the user
    if (isLoading) {
        return <LoadingOverlay visible={isLoading} overlayBlur={2} />
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


    // table
    return (
        <div>

            {/* search bar */}
            <TextInput
                placeholder="Search by any field"
                mt={50}
                mb={50}
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                 value={search}
                // onChange={handleSearchChange}
                w={800}
             style={{ position: "relative", left: "50%", translate: "-50%" }}
            />

            <ScrollArea
                w={"100mw"}
                h={800}
                onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
            >
                <Table
                    highlightOnHover
                    horizontalSpacing={70}
                    verticalSpacing="lg"
                    miw={700}
                    sx={{ tableLayout: "fixed" }}
                >
                    <thead
                        className={classes.tableHeadings}
                    >
                        <tr>
                            <th>Stock_id</th>
                            <th>Brand</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Added_Date</th>
                            <th>Warranty</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows !== null ? rows.length > 0 ? (
                            rows
                        ) : (
                            <tr>
                                <td>
                                    <Text weight={500} align="center">
                                        Nothing found
                                    </Text>
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </Table>
            </ScrollArea>

        </div>
    );
};

export default PendingStock;
