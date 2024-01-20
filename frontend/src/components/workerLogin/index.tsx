import { Button, Card, Group, Image, Text } from "@mantine/core";
import User from '../../assets/userlogo.png';
import Admin from "../../assets/admin.png";
import { useEffect } from "react";
import AOS from 'aos';

import 'aos/dist/aos.css';

const WorkerLogin = () =>{

  useEffect(()=>{
    AOS.init();
},[]);

    return(
      <Card shadow="lg" withBorder radius="md" p="md" w={300} data-aos="fade-up" data-aos-delay="200" data-aos-easing="ease-in-sine">
        <Card.Section withBorder>
          <Group position="center" m={50}>
            <Image src={Admin} alt="Admin photo" height={100} width={100} />
          </Group>
        </Card.Section>
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
            {/* <Button color="blue" p={10} component="a" href="/login/worker"> */}
            <Button variant="gradient" component="a" href="/login/worker" gradient={{ from: 'indigo', to: 'cyan' }}>
              Worker Login
            </Button>
          </Group>
        </Card.Section>
      </Card>
    )
};

export default WorkerLogin;