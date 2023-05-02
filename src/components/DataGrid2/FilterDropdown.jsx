import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, FormHelperText, Button, Popover, CardContent, Card } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useMemo, useState } from 'react';

const useStyles = makeStyles()((theme) => {
  return {
    filterContainer: {
      paddingBottom: theme.spacing(2),
      maxWidth: '40vw',
      height: '100%',
      maxHeight: '80vh',
      minHeight: '200px',
    },
    dropdownButton: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      flex: 'auto'
    },
    dropdownContainer: {
        minWidth: 400,
        height: '100%',
        maxHeight: '80vh',
        minHeight: '200px',
        overflowY: 'auto'
    }
  }
});
const FilterDropdown = ({ value, name, filterRenderer: FilterRenderer, onChangeFilter, onChangeFilterDisplay }) => {
  const { classes } = useStyles()
  const [filterAnchor, setFilterAnchor] = useState(false);
  const isFilterOpen = Boolean(filterAnchor)

  const handleOpenFilter = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  return <>
    <Button variant={value ? "contained" : "outlined"}
      color={value ? "primary" : "inherit"}
      className={classes.dropdownButton}
      onClick={handleOpenFilter}

      endIcon={<FontAwesomeIcon icon={isFilterOpen ? faCaretUp : faCaretDown} />}
    >{name}</Button>
    <Popover
      open={isFilterOpen}
      anchorEl={filterAnchor}
      onClose={() => setFilterAnchor(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        // minWidth: '400px',
      }}
    >
      <Card className={classes.dropdownContainer}>
        <CardContent>
          <FormControl variant="standard" className={classes.filterContainer} fullWidth>
            <FormHelperText>{name}</FormHelperText>
            <FilterRenderer
              value={value}
              onChange={(v) => {
                onChangeFilter(v);
              }}
              onChangeDisplay={(v) => {
                onChangeFilterDisplay(v);
              }}
            />
          </FormControl>
        </CardContent>
      </Card>
    </Popover>
  </>;

}

export { FilterDropdown }