import { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface KebabMenuProps {
    items: Array<{ name: string; onClick: () => void }>;
}

const KebabMenu = ({ items }: Readonly<KebabMenuProps>) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event | SyntheticEvent) => {
        if (anchorRef.current?.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    const handleMenuItemClick = (onClick: () => void) => {
        onClick();
        setOpen(false);
    };

    function handleListKeyDown(event: KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current && !open) {
            anchorRef.current?.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Stack direction="row" spacing={2}>
            <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={() => {
                    handleToggle();
                }}>
                <MoreVertIcon />
            </Button>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 100 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}>
                                    {items.map((item) => (
                                        <MenuItem
                                            key={item.name}
                                            onClick={() => {
                                                handleMenuItemClick(item.onClick);
                                            }}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Stack>
    );
};

export default KebabMenu;
