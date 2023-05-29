import React from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import {Route, Routes, useNavigate} from "react-router-dom";
import {routers} from "../app/routes";

export const MainPage = () => {
    const drawerWidth = 240;

    const navigate = useNavigate();
    const theme = useTheme();

    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('Menu');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
        ({theme, open}) => ({
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${drawerWidth}px`,
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            }),
        }),
    );

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{mr: 2, ...(open && {display: 'none'})}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    {
                        routers.map((item, i) => {
                            return (
                                <ListItem key={i} disablePadding>
                                    <ListItemButton onClick={() => { setName(item.name); navigate(item.url) }}>
                                        <ListItemIcon>
                                            <MenuBookTwoToneIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={item.name}/>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })
                    }
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader/>

                <Routes>
                    {
                        routers.map((item, i) => {
                            return <Route
                                key={i}
                                path={item.url}
                                element={item.element}
                            />;
                        })
                    }
                </Routes>
            </Main>
        </Box>
    );
};
