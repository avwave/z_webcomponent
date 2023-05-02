import { makeStyles } from 'tss-react/mui';


const colorStyles = makeStyles()(theme => ({
    //todo: primary and secondary color
    primary: {
        backgroundColor: '#A2CEE4'
    },
    secondary: {
        backgroundColor: '#A2CEE4'
    },
    success: {
        backgroundColor: '#00da3c'
    },
    danger: {
        backgroundColor: '#ef3c40'
    },
    warning: {
        backgroundColor: '#f1b434'
    },
    info: {
        backgroundColor: '#bdebff'
    },
//todo: light, dark. lighter and darker version of brand color

}));


export {colorStyles} 