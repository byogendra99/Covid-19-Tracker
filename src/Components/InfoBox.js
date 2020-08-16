import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox({ title, casesToday, isRed, active, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBoxSelected"} ${
            isRed && "infoBoxRed"
            }`}>
            <CardContent>
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>
                <h4 className={`infoBox_casesToday ${!isRed && "infoBox_casesTodayGreen"}`}>{casesToday}</h4>
                <Typography className="infoBox_total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
