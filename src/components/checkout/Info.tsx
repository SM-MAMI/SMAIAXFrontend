import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const products = [
    {
        name: 'Smart Meter Connector',
        desc: 'Device for connecting your personal Smart Meter to SMAIA-X',
        price: '39.99€',
    },
];

interface InfoProps {
    totalPrice: string;
}

export default function Info({ totalPrice }: InfoProps) {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Total
            </Typography>
            <Typography variant="h4" gutterBottom>
                {totalPrice}
            </Typography>
            <List disablePadding>
                {products.map((product) => (
                    <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
                        <ListItemText sx={{ mr: 2 }} primary={product.name} secondary={product.desc} />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {product.price}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </React.Fragment>
    );
}
