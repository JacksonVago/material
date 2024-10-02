import { Box, Button, Card, CardContent, CardMedia, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";

export const CarouselDestaque: React.FC = (props) => {
    return (
        <Carousel 
        animation="slide"
        next={ (next, active) => {} }
        prev={ (prev, active) => {} }
        indicators={false}
        >
            {
                items.map((item, i) => 
                <Item key={i} item={item} />
            )
            }
        </Carousel>
    )
}

function Item(props:any)
{
    return (
        <Grid item xl={2} lg={3}  md={4} sm={6} xs={12} margin={1} >
        <Box component={Paper}>
            <Card>
                <CardMedia
                    component="img"
                    height="250"
                    image={props.item.image}
                    alt="Jackson"
                />
            </Card>
        </Box>
    </Grid>
)
}
var items = [
    {
        name: "Random Name #1",
        description: "Probably the most random thing you have ever seen!",
        image: "./hamburguers.jpg",
    },
    {
        name: "Random Name #2",
        description: "Hello World!",
        image: "./grelha.jpg",
    },
    {
        name: "Random Name #3",
        description: "Fuck Off!",
        image: "./hotdog.jpg",
    },
    {
        name: "Random Name #4",
        description: "Fuck Off!",
        image: "./combo.jpg",
    },
    {
        name: "Random Name #5",
        description: "Fuck Off!",
        image: "./familia.jpg",
    }


]