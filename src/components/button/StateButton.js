import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { colorStyles } from "../../shared/colorPalette.js";

const useStyles = makeStyles()(theme => ({
    roundedButton: {
        borderRadius: 25
    }
}));


export default function StateButton(props) {
    const { classes } = useStyles();
    const cPlt = colorStyles();
    const {color, text, textColor, variant, disableRipple, icon, onClick, size, disabled} = props
    const possibleColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    const possibleVariants = ['contained', 'outlined', 'text'];

    const [buttonColor, setButtonColor] = useState("primary");
    const [actualColor, setActualColor] = useState("");
    const [customColor, setCustomColor] = useState(() => {});

    const [buttonVariant, setButtonVariant] = useState("contained");

    const [activeClasses, setActiveClasses] = useState([]);
    /**
     * <RaisedButton
      label="Submit"
      buttonStyle={{ borderRadius: 25 }}
      style={{ borderRadius: 25 }}
      labelColor={'#FFFFFF'}
      backgroundColor={"#0066e8"}
    />

    [variant]
    contained - high emphasis elevation
    outlined - low emphasis
    text - less pronounced actions
    pill - pill shape
    pill-outline - pull outline shape
    // perhaps make it so the attributes are modular, like you can make it so it can be outline type and shape

    [color]
    // need some kind of globals for this
    primary - primary brand color
    secondary - secondary
    success - green
    danger - red
    warning - yellow
    info - light neutral
    light - lightest brand color
    dark - darker brand color
     */


    useEffect(() => {
        console.log('hello');
        console.log(color);
        if (color && possibleColors.indexOf(color.toLowerCase()) >= 0) {
            // in list
            switch (color) {
                case 'primary':
                    console.log('youre nonoo')
                    setButtonColor('primary');
                    setActualColor(cPlt.primary);
                    break;
                case 'secondary':
                    setButtonColor('secondary');
                    setActualColor(cPlt.secondary);
                    break;
                case 'success':
                    setButtonColor('primary');
                    setActualColor(cPlt.success);
                    break;
                case 'danger':
                    console.log('youre danger')
                    setButtonColor('primary');
                    setActualColor(cPlt.danger);
                    console.log(classes.roundedButton);
                    console.log(cPlt.danger);
                    break;
                case 'warning':
                    setButtonColor('primary');
                    setActualColor(cPlt.warning);
                    break;
                case 'info':
                    setButtonColor('primary');
                    setActualColor(cPlt.info);
                    break;
                default:
                    console.log('youre nonono')
                    setButtonColor('primary');
                    setActualColor(cPlt.primary);
                    break;
            }
        }
        else if (color && color.trim().indexOf('#') == 0) {
            //custom color
            setButtonColor('primary');
            setCustomColor(makeStyles()(theme => ({
                custom: {
                    backgroundColor: color
                }
            })))
            setActualColor(customColor.custom);
        }
        else {
            setButtonColor('primary');
        }

        var isPill = false;
        if (variant && possibleVariants.indexOf(variant.toLowerCase()) >= 0) {
            switch(variant) {
                case 'text':
                    break;
                case 'pill':
                    setButtonVariant('contained');
                    isPill = true;
                    break;
                case 'pill-outline':
                    setButtonVariant('outline');
                    isPill = true;
                    break;
                default:
                    setButtonVariant(variant);
                    break;
            }
        }
        else {
            setButtonVariant('contained');
        }

        var clss = [];
        if (actualColor) {
            clss.push(actualColor);
        }
        if (isPill) {
            console.log('we pillin brug')
            clss.push(classes.roundedButton);
        }
        setActiveClasses(clss);
        
        console.log('activeClasses');
        console.log(activeClasses);


    }, [cPlt, classes])


    return (
        <Button variant={buttonVariant} color={buttonColor} className={activeClasses ? activeClasses.join(" ") : ""} disableRipple={disableRipple} onClick={onClick ? onClick : () => {}}
        disabled={disabled}>
            {text}
        </Button>
    )
}