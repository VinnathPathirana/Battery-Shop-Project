import { useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  Code,
  getStylesRef,
  rem,
  Image,
  Avatar,
} from "@mantine/core";
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconNotification,
  IconAdjustmentsHeart,
  IconTrash,
} from "@tabler/icons-react";
// import { MantineLogo } from "@mantine/ds";
import profitBoard from "../ProfitDashboard/index";
// import logo from "../../assets/shopLogo.png";
import logo from "../../assets/shopLogonew.png";
import StockTable from "../stock";
import { Menu } from "@mantine/core";



const adminDashboard = createStyles((theme) => ({


  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

    links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    marginBottom : 20,
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const links = [

  { link: "/admin/manageworker", label: "Manage Worker", icon: IconAdjustmentsHeart },
  { link: "/admin/profitpage", label: "Profit", icon: IconReceipt2 },
  { link: "/admin/stockpage", label: "Pending Stock", icon: IconDatabaseImport },
  { link: "/admin/deletedtable", label: "Delete Stock", icon: IconTrash },
  // { link: "", label: "Notifications", icon: IconNotification },
  

];

const AdminDashboardHeader = ({link_id} : any) => {

  const user = JSON.parse(localStorage.getItem('user-worker-session')!!);

 
    
  const [active, setActive] = useState(links[link_id].link);
  const { classes, cx } = adminDashboard();
  //const [active, setActive] = useState("Billing");

  const items = links.map((link,index) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: active=== link.link,
      })}
      href={link.link}
      key={link.label}
      onClick={(event) => {
        event.preventDefault();
        window.location.href = link.link;
        setActive(link.label);
      }}
    >
      <link.icon className={classes.linkIcon} stroke={1.5} />
      <span>{link.label}</span>
    </a>
  ));
  return (
    <div  style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar width={{ sm: 250 }} p="md" style={{ backgroundColor: 'lightblue', flex: 1 }}>
          <Navbar.Section grow>
            <Group className={classes.header} position="apart">
              <Image width={200} height={50} src={logo} mt={5} />
            </Group>
            {items}
          </Navbar.Section>

          <Navbar.Section className={classes.footer} >
            <a
            
              href="/admin/logout"
              className={classes.link}
              // onClick={(event) => event.preventDefault()}
            >
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span >Logout</span>
            </a>
          </Navbar.Section>
        </Navbar>
      </div>
      <div>
        {/* <StockTable /> */}
      </div>
    </div>
  );
}

export default AdminDashboardHeader;
