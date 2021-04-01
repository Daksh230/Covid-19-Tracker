import React from 'react'
import {Card, Typography, CardContent} from '@material-ui/core';
import "./infobox.css"

function Infobox({title, cases, isRed, total, active, ...props}) {


    return (
            <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
                <CardContent>
                    <Typography align="center" color="textSecondary" className='infoBox__title'>
                        {title}
                    </Typography>
                    
                    {/* Cases */}
                    <h2  className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`} align="center" >{cases}</h2>
                    
                    {/* Total cases */}
                    <Typography  align="center" className='infoBox__total' color="textSecondary">{total} Total</Typography>
                </CardContent>
            </Card>
    )
}

export default Infobox
