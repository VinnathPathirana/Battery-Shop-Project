import { Button, Card, Group, Image, Text } from "@mantine/core";
import Admin from "../../assets/admin.png";
import User from '../../assets/userlogo.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
const AdminLogin = () => {

  useEffect(()=>{
    AOS.init();
},[]);

  return (
    <Card shadow="lg" withBorder radius="md" p="md" w={300} data-aos="fade-up" data-aos-delay="150" data-aos-easing="ease-in-sine">
      <Card.Section withBorder>
        <Group position="center" m={50}>
          <Image src={User} alt="Admin photo" height={100} width={100} />
        </Group>
      </Card.Section>

      {/* <Card withBorder radius="md" p="md" >
      <Card.Section>
        <Image src={Admin} alt="Admin photo" height={180} />
      </Card.Section> */}

      <Card.Section inheritPadding>
        <Text weight={400} p={20} style={{ textAlign: "justify" }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto illum
          nihil animi quisquam minima? Voluptas beatae vero omnis necessitatibus
          culpa numquam animi accusamus rerum similique voluptatum. Laborum
          nobis sequi veniam?
        </Text>
      </Card.Section>
      <Card.Section>
        <Group position="center" grow m={10}>
          {/* <Button color="blue" p={10} component="a" href="/login/admin"> */}
          <Button variant="gradient" component="a" href="/login/admin" gradient={{ from: 'teal', to: 'lime', deg: 105  }}>
            Admin Login
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default AdminLogin;
