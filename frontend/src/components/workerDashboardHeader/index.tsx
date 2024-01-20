import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  Image,
  Text,
  Menu,
  UnstyledButton,
  Avatar
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "../../assets/shopLogo.png";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: rem(56),

    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    alignItems: "center",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));

const links = [
  { label: "Manage Stock", link: "/worker/manageStock" },
  { label: "Pending Stocks", link: "/worker/notifications" },
  { label: "Invoices", link: "/worker/invoice" },
];

const WorkerDashboardHeader = ({link_id} : any) => {

  const [active, setActive] = useState(links[link_id].link);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = useStyles();

  const user = JSON.parse(localStorage.getItem('user-worker-session')!!);

  const items = links.map((link,index) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        window.location.href = link.link;
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));
  return (
    <Header height={60} mb={120}>
      <Group position="apart" px={70}>
        <Image width={200} height={50} src={logo} mt={5}/>
        <Group spacing={10} className={classes.links}>
          {items}
        </Group>

        <Menu
            width={260}
            position="bottom-end"
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  {/* profile picture */}
                  <Avatar src={null} alt="profile pic" color="indigo" radius={"lg"}>{user.name.slice(0,2)}</Avatar>

                  <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    {user.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{user.role === 'ADMIN'? 'Administrator' : "Worker"}</Menu.Label>
              
              <Menu.Item icon={<IconLogout size={14} stroke={1.5} />} >
              <a
              href="/worker/logout"
              className={classes.link}
              onClick={(event) => {event.preventDefault(); window.location.href = '/worker/logout'}}
            >
                  Logout
                </a>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
      </Group>
    </Header>
  );
};

export default WorkerDashboardHeader;
