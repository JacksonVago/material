import { Box, Button, Card, CardContent, CardMedia, Grid, Icon, Paper, Typography } from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";

export const CarouselPromo: React.FC = (props) => {
    return (
        <Carousel 
        animation="slide"
        next={ (next, active) => console.log(`we left ${active}, and are now at ${next}`) }
        prev={ (prev, active) => console.log(`we left ${active}, and are now at ${prev}`) }
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
                {/* <CardHeader
                    avatar={
                        <Box display='flex' flexDirection='column'>
                        <Icon>person</Icon>                                    
                    </Box>

                    }
                /> */}
                <CardMedia
                    component="img"
                    height="194"
                    image="./avatar_jackson.jpg"
                    alt="Jackson"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.item.name}
                    </Typography>
                    <Box display='flex' alignItems='center' gap={2}>
                        <Icon>
                            person
                        </Icon>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {props.item.description}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Grid>
)
}
var items = [
    {
        name: "Random Name #1",
        description: "Probably the most random thing you have ever seen!"
    },
    {
        name: "Random Name #2",
        description: "Hello World!"
    },
    {
        name: "Random Name #3",
        description: "Fuck Off!"
    },
    {
        name: "Random Name #4",
        description: "Fuck Off!"
    },
    {
        name: "Random Name #5",
        description: "Fuck Off!"
    }


]