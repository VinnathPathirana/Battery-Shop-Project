import { useRef, useState } from "react";
import {useReactToPrint} from "react-to-print";
import { Box, Group, Text, Button, Table, Image } from "@mantine/core";
import logo from "../../assets/shopLogo.png";

const InvoiceTemplate = (props: any) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [data, setData] = useState(props.data);

  // format number to SL rupee
  let rupee = new Intl.NumberFormat("ta-LK", {
    style: "currency",
    currency: "LKR",
  });

  const rows = data.items.map((item: any) => (
    <tr id={item._id}>
      <td>{item.brand}</td>
      <td>{item.warranty}</td>
      <td>{rupee.format(item.price)}</td>
      <td>{item.quantity}</td>
      <td>{rupee.format(item.totalPrice)}</td>
    </tr>
  ));
  console.log(data);
  return (
    <>
      <Box ref={componentRef} p={30} mb={30}>
        <Group position="left">
          <Image src={logo} width={280} height={80} />
        </Group>

        <Text size="md" weight={500} align="right" mb={-20}>
          Shop Name
        </Text>
        <br />
        <Text size="sm" align="right" mb={-20}>
          Malabe,Colombo
        </Text>
        <br />
        <Text size="sm" align="right" mb={-20}>
          shopname@gmail.com
        </Text>
        <br />
        <Text size="sm" align="right">
          011-1234567
        </Text>
        <br />

        <Text size="md" weight={500} align="left" mb={-20}>
          {data.cusName}
        </Text>
        <br />
        <Text size="sm" align="left" mb={-20}>
          {data.cusPhone}
        </Text>
        <br />
        <Text size="sm" align="left" mb={-20}>
          {data.cusAddress}
        </Text>
        <br />
        <Text size="sm" align="left">
          {new Date(data.issuedDate).toLocaleDateString("en-GB").split("T")[0]}
        </Text>
        <br />

        <Table horizontalSpacing={50} verticalSpacing="md" mt={10}>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Warranty</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total price</th>
            </tr>
          </thead>
          <tbody>
            {rows}
            {data.discount !== 0 ? (
              <tr>
                <td colSpan={4}>
                  <Text align="center" weight={500}>
                    DISCOUNT
                  </Text>
                </td>
                <td>
                  <Text color="gray">{rupee.format(data.discount)}</Text>
                </td>
              </tr>
            ) : null}
            <tr>
              <td colSpan={4}>
                {" "}
                <Text align="center" weight={500}>
                  TOTAL
                </Text>
              </td>
              <td style={{ borderBottom: "1px double black" }}>
                <Text weight={500}>{rupee.format(data.totalSoldPrice)}</Text>
              </td>
            </tr>
          </tbody>
        </Table>
        <Text color="gray" size={"xs"} opacity={0.5} align="justify" mt={50}>
          Products purchased directly from [Battery Shop Name] are eligible for
          returns within [X] calendar days from the date of purchase. To
          initiate a return, contact our customer service team with your invoice
          number, product details, and reason for return. The product must be in
          its original condition, packaging, and accessories. Battery products
          must not be activated, installed, or used. For more details, please
          refer to our complete return policy above or contact our customer
          service team.
        </Text>
        <Text mt={40} size={"lg"} weight={600} align="center">Thank You!</Text>
      </Box>
      <Group grow>
      <Button onClick={handlePrint}>Print</Button></Group>
    </>
  );
};

export default InvoiceTemplate;
